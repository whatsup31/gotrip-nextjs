// utils/contracts/listing
import { z } from "zod";

export const ListingCreateSchema = z.object({
  title: z.string().min(3),
  location: z.string().min(2),
  description: z.string().optional(),
  price_per_night: z.coerce.number().positive(),
  photos: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
});
export type ListingCreateInput = z.infer<typeof ListingCreateSchema>;

export type ApiError = { ok: false; errors: { field?: string; message: string }[] };
export type ApiSuccess<T> = { ok: true; data: T };
