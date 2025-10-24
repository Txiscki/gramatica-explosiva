import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createUserProfile } from "./userService";

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(userCredential.user.uid, {
    email,
    displayName,
    role: "student"
  });
  return userCredential.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  
  // Create profile if new user
  await createUserProfile(userCredential.user.uid, {
    email: userCredential.user.email || "",
    displayName: userCredential.user.displayName || "User",
    role: "student"
  });
  
  return userCredential.user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
