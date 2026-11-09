import { z } from "zod";


// Password validation
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(66, "Password must not exceed 66 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );



export const signupUserInputSchemaDto = z.object({
  name: z.string().trim()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),

  email: z.email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .trim().toLowerCase(),

  password: passwordSchema,
});



export const signinUserInputSchemaDto = z.object({
  email: z.email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .trim().toLowerCase(),

  password: passwordSchema,
});
