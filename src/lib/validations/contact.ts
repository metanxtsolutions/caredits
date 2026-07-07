import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(10, "Please share a few details about your project"),
});

export type ContactInput = z.infer<typeof contactSchema>;
