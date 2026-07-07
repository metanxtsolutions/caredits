import { z } from "zod";

export const requestOtpSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
  code: z.string().length(6, "Enter the 6-digit code"),
  name: z.string().min(2, "Please enter your name").optional(),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
