import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// Generate a unique 6-character teacher code
export const generateTeacherCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like 0, O, I, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Get or create teacher code
export const getOrCreateTeacherCode = async (teacherId: string): Promise<string> => {
  try {
    const teacherCodeRef = doc(db, "teacher_codes", teacherId);
    const docSnap = await getDoc(teacherCodeRef);
    
    if (docSnap.exists()) {
      return docSnap.data().code;
    }
    
    // Generate new code
    let code = generateTeacherCode();
    let isUnique = false;
    
    // Ensure uniqueness (check if code already exists)
    while (!isUnique) {
      const codeCheckRef = doc(db, "code_to_teacher", code);
      const codeSnap = await getDoc(codeCheckRef);
      if (!codeSnap.exists()) {
        isUnique = true;
      } else {
        code = generateTeacherCode();
      }
    }
    
    // Save teacher code mapping
    await setDoc(teacherCodeRef, {
      code,
      teacherId,
      createdAt: Date.now()
    });
    
    // Save reverse mapping for quick lookup
    await setDoc(doc(db, "code_to_teacher", code), {
      teacherId,
      createdAt: Date.now()
    });
    
    return code;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error creating teacher code:", error);
    }
    throw new Error("Failed to generate teacher code");
  }
};

// Link student to teacher using code
export const linkStudentToTeacher = async (studentId: string, teacherCode: string): Promise<boolean> => {
  try {
    // Validate input format
    const sanitizedCode = teacherCode.trim().toUpperCase();
    
    if (!/^[A-Z2-9]{6}$/.test(sanitizedCode)) {
      throw new Error("Invalid code format. Teacher codes are exactly 6 characters (A-Z, 2-9).");
    }
    
    // Find teacher by code
    const codeRef = doc(db, "code_to_teacher", sanitizedCode);
    const codeSnap = await getDoc(codeRef);
    
    if (!codeSnap.exists()) {
      throw new Error("Invalid teacher code");
    }
    
    const teacherId = codeSnap.data().teacherId;
    
    // Add student to teacher's favorite students
    const teacherRef = doc(db, "users", teacherId);
    await updateDoc(teacherRef, {
      favoriteStudents: arrayUnion(studentId)
    });
    
    // Update student's profile with teacher reference
    const studentRef = doc(db, "users", studentId);
    await updateDoc(studentRef, {
      linkedTeacher: teacherId
    });
    
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error linking student to teacher:", error);
    }
    throw error;
  }
};

// Get teacher ID for a student
export const getLinkedTeacher = async (studentId: string): Promise<string | null> => {
  try {
    const studentRef = doc(db, "users", studentId);
    const docSnap = await getDoc(studentRef);
    
    if (docSnap.exists() && docSnap.data().linkedTeacher) {
      return docSnap.data().linkedTeacher;
    }
    
    return null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error getting linked teacher:", error);
    }
    return null;
  }
};
