import { z } from "zod";

// Authentication validation schemas
export const signUpSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password must be less than 128 characters"),
  displayName: z.string().trim().min(1, "Display name is required").max(100, "Display name must be less than 100 characters")
});

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(1, "Password is required").max(128, "Password must be less than 128 characters")
});

// User profile validation schema
export const userProfileSchema = z.object({
  email: z.string().trim().email().max(255),
  displayName: z.string().trim().min(1).max(100),
  organizationId: z.string().max(100).optional(),
  classGroup: z.string().max(100).optional(),
  favoriteStudents: z.array(z.string().max(100)).optional()
});

// Game session validation schema
export const gameSessionSchema = z.object({
  userId: z.string().max(128),
  displayName: z.string().trim().min(1).max(100),
  difficulty: z.enum(["a2", "b1", "b2", "c1", "c2"]),
  score: z.number().int().min(0).max(1000000),
  streak: z.number().int().min(0).max(10000),
  timestamp: z.number().int().positive(),
  totalQuestions: z.number().int().min(0).max(1000),
  correctAnswers: z.number().int().min(0).max(1000),
  wrongAnswers: z.number().int().min(0).max(1000),
  completionTimeSeconds: z.number().int().min(0).max(86400),
  isPerfectGame: z.boolean(),
  hadComeback: z.boolean(),
  isInfiniteMode: z.boolean().optional()
});

// Achievement validation schema
export const userAchievementSchema = z.object({
  userId: z.string().max(128),
  achievementId: z.string().max(100),
  earnedAt: z.number().int().positive()
});

// Leaderboard entry validation schema
export const leaderboardEntrySchema = z.object({
  name: z.string().trim().min(1).max(100),
  score: z.number().int().min(0).max(1000000).optional(),
  streak: z.number().int().min(0).max(10000).optional(),
  timestamp: z.number().int().positive()
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type GameSessionInput = z.infer<typeof gameSessionSchema>;
export type UserAchievementInput = z.infer<typeof userAchievementSchema>;
export type LeaderboardEntryInput = z.infer<typeof leaderboardEntrySchema>;
