import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export type AppRole = "student" | "teacher";

export interface UserRole {
  id?: string;
  userId: string;
  role: AppRole;
}

export const createUserRole = async (userId: string, role: AppRole = "student") => {
  try {
    const roleRef = doc(db, "user_roles", userId);
    const docSnap = await getDoc(roleRef);
    
    if (docSnap.exists()) {
      return;
    }
    
    await setDoc(roleRef, {
      userId,
      role,
      createdAt: Date.now()
    });
  } catch (error) {
    throw new Error("Unable to create user role");
  }
};

export const getUserRole = async (userId: string): Promise<AppRole> => {
  try {
    const roleRef = doc(db, "user_roles", userId);
    const docSnap = await getDoc(roleRef);
    
    if (docSnap.exists()) {
      return docSnap.data().role as AppRole;
    }
    return "student"; // Default role
  } catch (error) {
    return "student";
  }
};

export const getAllUserRoles = async (): Promise<UserRole[]> => {
  try {
    const rolesRef = collection(db, "user_roles");
    const querySnapshot = await getDocs(rolesRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserRole));
  } catch (error) {
    return [];
  }
};
