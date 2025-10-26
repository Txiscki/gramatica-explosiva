import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export interface Organization {
  id?: string;
  name: string;
  createdAt: number;
  ownerId: string;
}

export const createOrganization = async (name: string, ownerId: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "organizations"), {
      name,
      createdAt: Date.now(),
      ownerId
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
};

export const getOrganization = async (organizationId: string): Promise<Organization | null> => {
  try {
    const docRef = doc(db, "organizations", organizationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Organization;
    }
    return null;
  } catch (error) {
    console.error("Error getting organization:", error);
    return null;
  }
};

export const getUserOrganizations = async (userId: string): Promise<Organization[]> => {
  try {
    const q = query(collection(db, "organizations"), where("ownerId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Organization));
  } catch (error) {
    console.error("Error getting user organizations:", error);
    return [];
  }
};
