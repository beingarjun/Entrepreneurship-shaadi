import { z } from 'zod';

// User registration schema
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  stage: z.enum(['IDEA', 'MVP', 'EARLY_STAGE', 'GROWTH', 'MATURE']).optional(),
  location: z.string().optional(),
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  stage: z.enum(['IDEA', 'MVP', 'EARLY_STAGE', 'GROWTH', 'MATURE']).optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional(),
  twitter: z.string().optional(),
  lookingFor: z.array(z.enum(['CO_FOUNDER', 'ADVISOR', 'INVESTOR', 'MENTOR', 'PARTNER'])).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

// Persona creation schema
export const personaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  targetAudience: z.string(),
  goals: z.array(z.string()),
  challenges: z.array(z.string()),
  isActive: z.boolean().default(true),
});

// Match preferences schema
export const matchPreferencesSchema = z.object({
  industries: z.array(z.string()).optional(),
  stages: z.array(z.enum(['IDEA', 'MVP', 'EARLY_STAGE', 'GROWTH', 'MATURE'])).optional(),
  locations: z.array(z.string()).optional(),
  lookingFor: z.array(z.enum(['CO_FOUNDER', 'ADVISOR', 'INVESTOR', 'MENTOR', 'PARTNER'])).optional(),
  excludeContacted: z.boolean().default(true),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PersonaInput = z.infer<typeof personaSchema>;
export type MatchPreferencesInput = z.infer<typeof matchPreferencesSchema>;