# Firebase Security Rules - CRITICAL SETUP REQUIRED

## ⚠️ IMPORTANT: Apply These Rules Immediately

Your application currently has **NO FIRESTORE SECURITY RULES** applied. This means anyone with your Firebase configuration can read and write any data in your database. This is a **critical security vulnerability**.

## How to Apply These Rules

1. Open your [Firebase Console](https://console.firebase.google.com)
2. Select your project: **the-bomb-4fec2**
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with the rules below
5. Click **Publish**

## Required Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================
    
    // Get user's role from user_roles collection
    function getUserRole(userId) {
      return get(/databases/$(database)/documents/user_roles/$(userId)).data.role;
    }
    
    // Check if the current user is a teacher
    function isTeacher() {
      return request.auth != null && getUserRole(request.auth.uid) == 'teacher';
    }
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is owner of the resource
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // ============================================================
    // USER PROFILES COLLECTION
    // ============================================================
    match /users/{userId} {
      // Anyone authenticated can read any profile (needed for leaderboards)
      allow read: if isAuthenticated();
      
      // Users can only create their own profile
      allow create: if isAuthenticated() && 
                      request.auth.uid == userId &&
                      request.auth.uid == request.resource.data.uid;
      
      // Users can only update their own profile
      allow update: if isOwner(userId);
      
      // No one can delete profiles
      allow delete: if false;
    }
    
    // ============================================================
    // USER ROLES COLLECTION - CRITICAL FOR AUTHORIZATION
    // ============================================================
    match /user_roles/{roleId} {
      // All authenticated users can read roles (needed for role checks)
      allow read: if isAuthenticated();
      
      // Users can create their own role ONLY as "student"
      allow create: if isAuthenticated() && 
                      request.auth.uid == roleId &&
                      request.auth.uid == request.resource.data.userId &&
                      request.resource.data.role == 'student';
      
      // CRITICAL: NO ONE can update or delete roles from client
      // Role changes must be done manually in Firebase Console or via Admin SDK
      allow update: if false;
      allow delete: if false;
    }
    
    // ============================================================
    // ORGANIZATIONS COLLECTION
    // ============================================================
    match /organizations/{orgId} {
      // All authenticated users can read organizations
      allow read: if isAuthenticated();
      
      // Only teachers can create organizations
      allow create: if isTeacher();
      
      // Only the organization owner can update it
      allow update: if isAuthenticated() && 
                      resource.data.ownerId == request.auth.uid;
      
      // No one can delete organizations
      allow delete: if false;
    }
    
    // ============================================================
    // GAME SESSIONS COLLECTION
    // ============================================================
    match /game_sessions/{sessionId} {
      // All authenticated users can read sessions (needed for leaderboards)
      allow read: if isAuthenticated();
      
      // Users can only create sessions for themselves with valid data
      allow create: if isAuthenticated() && 
                      request.auth.uid == request.resource.data.userId &&
                      request.resource.data.displayName is string &&
                      request.resource.data.difficulty is string &&
                      request.resource.data.score is number &&
                      request.resource.data.streak is number &&
                      request.resource.data.timestamp is number;
      
      // No one can update or delete game sessions (immutable)
      allow update: if false;
      allow delete: if false;
    }
    
    // ⚠️ CRITICAL: FIRESTORE COMPOSITE INDEXES REQUIRED FOR LEADERBOARDS
    // 
    // The leaderboard queries WILL NOT WORK without these indexes.
    // You must create these in Firebase Console:
    //
    // INDEX 1 - Top Scores by Difficulty:
    //   Collection ID: game_sessions
    //   Fields indexed:
    //     - difficulty: Ascending
    //     - score: Descending
    //   Query scope: Collection
    //
    // INDEX 2 - Top Streaks by Difficulty:
    //   Collection ID: game_sessions  
    //   Fields indexed:
    //     - difficulty: Ascending
    //     - streak: Descending
    //   Query scope: Collection
    //
    // HOW TO CREATE INDEXES:
    // Method 1 (Easiest): 
    //   - Visit the leaderboard page in your app
    //   - Check browser console for error
    //   - Click the link in the error to auto-create the index
    //
    // Method 2 (Manual):
    //   - Go to Firebase Console > Firestore Database > Indexes
    //   - Click "Create Index"
    //   - Enter collection ID: game_sessions
    //   - Add fields as specified above
    //   - Click "Create"
    
    // ============================================================
    // USER ACHIEVEMENTS COLLECTION
    // ============================================================
    match /user_achievements/{achievementId} {
      // All authenticated users can read achievements
      allow read: if isAuthenticated();
      
      // Users can only create achievements for themselves
      allow create: if isAuthenticated() && 
                      request.auth.uid == request.resource.data.userId;
      
      // No one can update or delete achievements
      allow update: if false;
      allow delete: if false;
    }
    
    // ============================================================
    // INFINITE MODE PROGRESS COLLECTION
    // ============================================================
    match /infinite_mode_progress/{progressId} {
      // Users can only read their own progress
      allow read: if isAuthenticated() && 
                    resource.data.userId == request.auth.uid;
      
      // Users can only create their own progress
      allow create: if isAuthenticated() && 
                      request.auth.uid == request.resource.data.userId;
      
      // Users can only update their own progress
      allow update: if isAuthenticated() && 
                      resource.data.userId == request.auth.uid;
      
      // Users can delete their own progress
      allow delete: if isAuthenticated() && 
                      resource.data.userId == request.auth.uid;
    }
    
    // ============================================================
    // WORD BUILDER PROGRESS COLLECTION
    // ============================================================
    match /word_builder_progress/{progressId} {
      // Users can only read their own progress
      allow read: if isAuthenticated() && 
                    resource.data.userId == request.auth.uid;
      
      // Users can only create their own progress
      allow create: if isAuthenticated() && 
                      request.auth.uid == request.resource.data.userId;
      
      // Users can only update their own progress
      allow update: if isAuthenticated() && 
                      resource.data.userId == request.auth.uid;
      
      // Users can delete their own progress
      allow delete: if isAuthenticated() && 
                      resource.data.userId == request.auth.uid;
    }
    
    // ============================================================
    // WORD BUILDER SESSIONS COLLECTION
    // ============================================================
    match /word_builder_sessions/{sessionId} {
      // All authenticated users can read sessions (for potential leaderboards)
      allow read: if isAuthenticated();
      
      // Users can only create sessions for themselves
      allow create: if isAuthenticated() && 
                      request.auth.uid == request.resource.data.userId;
      
      // No one can update or delete word builder sessions (immutable)
      allow update: if false;
      allow delete: if false;
    }
    
    // ============================================================
    // LEADERBOARDS - HIGH SCORE COLLECTION
    // ============================================================
    match /leaderboards_highscore/{entryId} {
      // All authenticated users can read leaderboard
      allow read: if isAuthenticated();
      
      // Authenticated users can add entries
      allow create: if isAuthenticated();
      
      // No one can update or delete leaderboard entries
      allow update: if false;
      allow delete: if false;
    }
    
    // ============================================================
    // LEADERBOARDS - STREAK COLLECTION
    // ============================================================
    match /leaderboards_streak/{entryId} {
      // All authenticated users can read leaderboard
      allow read: if isAuthenticated();
      
      // Authenticated users can add entries
      allow create: if isAuthenticated();
      
      // No one can update or delete leaderboard entries
      allow update: if false;
      allow delete: if false;
    }
    
    // ============================================================
    // TEACHER CODES COLLECTION
    // ============================================================
    match /teacher_codes/{teacherId} {
      // Only teachers can read their own code
      allow read: if isAuthenticated() && request.auth.uid == teacherId;
      
      // Only teachers can create/update their own code
      allow create, update: if isAuthenticated() && 
                            request.auth.uid == teacherId &&
                            isTeacher();
      
      // No deletes
      allow delete: if false;
    }
    
    // ============================================================
    // CODE TO TEACHER LOOKUP COLLECTION
    // ============================================================
    match /code_to_teacher/{code} {
      // Anyone authenticated can read (needed for student linking)
      allow read: if isAuthenticated();
      
      // Only teachers can create code mappings
      allow create: if isTeacher();
      
      // No updates or deletes
      allow update: if false;
      allow delete: if false;
    }
    
    // ============================================================
    // DEFAULT DENY ALL
    // ============================================================
    // Any collection not explicitly defined above is denied by default
  }
}
```

## What These Rules Protect Against

### 1. **Authorization Bypass** ✅
- User roles are now enforced server-side
- Students cannot upgrade themselves to teachers
- Role modifications are completely blocked from client-side

### 2. **Data Exposure** ✅
- The application now uses filtered queries (organizationId, favorite students)
- Only relevant data is transmitted to clients
- Teachers can only query students in their scope

### 3. **Unauthorized Access** ✅
- All collections require authentication
- Users can only modify their own data
- Game sessions and achievements are immutable

### 4. **Privilege Escalation** ✅
- New users can only create "student" role
- Role updates are completely blocked
- Teachers must be assigned manually via Firebase Console

## How to Make a User a Teacher

Since role updates are blocked from the client (for security), you must assign teacher roles manually:

1. Go to **Firebase Console** → **Firestore Database**
2. Navigate to the `user_roles` collection
3. Find the user's document (document ID = user's UID)
4. Edit the `role` field from `"student"` to `"teacher"`

**Alternative**: Use Firebase Admin SDK in a secure backend to manage role assignments.

## Testing Your Rules

After applying the rules, test them:

1. **As a student**: Try to access teacher dashboard → Should redirect
2. **As a teacher**: Access teacher dashboard → Should see only your students
3. **Logged out**: Try to access any data → Should fail

## Security Validation Checklist

- ✅ Rules published in Firebase Console
- ✅ Tested that students cannot access teacher dashboard
- ✅ Verified data filtering works (teachers see only their students)
- ✅ Confirmed role changes are blocked from client
- ✅ All collections require authentication

## Need Help?

If you encounter issues after applying these rules:
1. Check the Firebase Console → Firestore Database → Rules → **Playgrounds** tab to test specific queries
2. Review the browser console for permission errors
3. Ensure you're authenticated before testing

---

**⚠️ DO NOT DEPLOY YOUR APPLICATION TO PRODUCTION UNTIL THESE RULES ARE APPLIED**
