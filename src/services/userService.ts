import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
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
    console.error("Error creating user profile:", error);
    throw error;
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
