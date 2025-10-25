import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createUserProfile } from "./userService";
import { createUserRole } from "./userRoleService";

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user profile (without role)
  await createUserProfile(userCredential.user.uid, {
    email,
    displayName
  });
  
  // Create user role in separate table (default: student)
  await createUserRole(userCredential.user.uid, "student");
  
  return userCredential.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  
  // Create user profile if it doesn't exist (without role)
  await createUserProfile(userCredential.user.uid, {
    email: userCredential.user.email || "",
    displayName: userCredential.user.displayName || "User"
  });
  
  // Create user role if it doesn't exist (default: student)
  await createUserRole(userCredential.user.uid, "student");
  
  return userCredential.user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
