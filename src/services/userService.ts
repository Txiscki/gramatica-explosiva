import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, getDocs, query, where, documentId } from "firebase/firestore";
import { userProfileSchema } from "@/lib/validation";

export interface UserProfile {
  uid?: string;
  email: string;
  displayName: string;
  organizationId?: string;
  classGroup?: string;
  favoriteStudents?: string[];
  createdAt?: number;
}

export const createUserProfile = async (uid: string, profile: Omit<UserProfile, "uid" | "createdAt">) => {
  try {
    // Validate profile data
    const validatedProfile = userProfileSchema.parse(profile);
    
    const userRef = doc(db, "users", uid);
    
    // Check if profile already exists
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return;
    }
    
    await setDoc(userRef, {
      ...validatedProfile,
      uid,
      createdAt: Date.now()
    });
  } catch (error) {
    throw new Error("Unable to create user profile");
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);
  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};

export const getUsersByOrganization = async (organizationId: string): Promise<UserProfile[]> => {
  try {
    const q = query(
      collection(db, "users"),
      where("organizationId", "==", organizationId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    return [];
  }
};

export const getUsersByIds = async (userIds: string[]): Promise<UserProfile[]> => {
  try {
    if (userIds.length === 0) return [];
    
    // Firestore 'in' query limited to 30 items (previously 10), handle in batches
    const chunks: string[][] = [];
    for (let i = 0; i < userIds.length; i += 30) {
      chunks.push(userIds.slice(i, i + 30));
    }
    
    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const q = query(
          collection(db, "users"),
          where(documentId(), "in", chunk)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as UserProfile);
      })
    );
    
    return results.flat();
  } catch (error) {
    return [];
  }
};
