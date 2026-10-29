import { z } from 'zod';

// ==========================================
// User & Auth Schemas
// ==========================================
export const UserRoleSchema = z.enum([
  'CITIZEN',
  'PANCHAYAT_OFFICER',
  'BLOCK_ADMIN',
  'DISTRICT_ADMIN',
  'SUPER_ADMIN',
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const RequestOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian mobile number (+91XXXXXXXXXX)'),
});
export type RequestOtpDto = z.infer<typeof RequestOtpSchema>;

export const VerifyOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+91[6-9]\d{9}$/),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;

// ==========================================
// Grievance Schemas
// ==========================================
export const GrievanceCategorySchema = z.enum([
  'DRINKING_WATER',
  'ELECTRICITY_POLE',
  'ROAD_REPAIR',
  'SANITATION_DRAINAGE',
  'HEALTH_ANGANWADI',
  'PENSION_RATION',
  'OTHER',
]);
export type GrievanceCategory = z.infer<typeof GrievanceCategorySchema>;

export const GrievanceStatusSchema = z.enum([
  'SUBMITTED',
  'ACKNOWLEDGED',
  'IN_PROGRESS',
  'RESOLVED',
  'ESCALATED',
  'REJECTED',
]);
export type GrievanceStatus = z.infer<typeof GrievanceStatusSchema>;

export const CreateGrievanceSchema = z.object({
  category: GrievanceCategorySchema,
  title: z.string().min(3, 'Title is required').max(120),
  description: z.string().min(5, 'Detailed description is required').max(1000),
  panchayatId: z.string().uuid(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  addressLandmark: z.string().max(200).optional(),
  photoUrls: z.array(z.string().url()).optional().default([]),
  voiceNoteUrl: z.string().url().optional(),
  localClientId: z.string().optional(), // For offline outbox deduplication
});
export type CreateGrievanceDto = z.infer<typeof CreateGrievanceSchema>;

// ==========================================
// Scheme Schemas
// ==========================================
export const SchemeCategorySchema = z.enum([
  'AGRICULTURE',
  'HEALTH',
  'HOUSING',
  'EDUCATION',
  'PENSION',
  'WOMEN_CHILD',
  'EMPLOYMENT',
]);
export type SchemeCategory = z.infer<typeof SchemeCategorySchema>;

export interface SchemeDto {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  category: string;
  department: string;
  fundingType: string;
  directBenefitAmount: string | null;
  briefDescriptionEn: string;
  briefDescriptionHi: string;
  eligibilitySummaryEn: string;
  eligibilitySummaryHi: string;
  requiredDocs: string[];
  officialApplyUrl: string | null;
}

// ==========================================
// Mandi Price Schemas
// ==========================================
export interface MandiPriceDto {
  id: string;
  mandiName: string;
  district: string;
  state: string;
  commodity: string;
  variety?: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceUnit: string;
  arrivalDate: string;
}

// ==========================================
// Offline Mutation Outbox Schemas
// ==========================================
export interface OutboxMutation {
  id: string;
  type: 'CREATE_GRIEVANCE' | 'UPDATE_PROFILE' | 'APPLY_SCHEME';
  payload: any;
  createdAt: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'COMPLETED';
  errorMessage?: string;
}
