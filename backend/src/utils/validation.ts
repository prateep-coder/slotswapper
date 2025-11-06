import { z } from 'zod';

// Auth validation schemas
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Event validation schemas
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['BUSY', 'SWAPPABLE', 'SWAP_PENDING']).optional().default('BUSY')
});

export const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  startTime: z.string().min(1, 'Start time is required').optional(),
  endTime: z.string().min(1, 'End time is required').optional(),
  status: z.enum(['BUSY', 'SWAPPABLE', 'SWAP_PENDING']).optional()
});

export const updateEventStatusSchema = z.object({
  status: z.enum(['BUSY', 'SWAPPABLE', 'SWAP_PENDING'])
});

// Swap validation schemas
export const createSwapRequestSchema = z.object({
  mySlotId: z.string().min(1, 'My slot ID is required'),
  theirSlotId: z.string().min(1, 'Their slot ID is required')
});

export const swapResponseSchema = z.object({
  accept: z.boolean()
});