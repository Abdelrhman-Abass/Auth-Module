import * as z from 'zod';

export const createSignUpSchema = () =>
  z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;


export const signUpSchema = z
  .object({
    role: z.enum(['student', 'doctor']),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must match'),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    language: z.enum(['arabic', 'english']),
    educational_background: z.string().optional(),
    skills: z.string().optional(),
    cv: z.instanceof(File).optional(),
    certificate: z.instanceof(File).optional(),
    organization: z.string().optional(),
    bio: z.string().optional(),
    expertise: z.string().optional(),
    license: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (data.role === 'student') {
      if (!data.educational_background) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['educational_background'],
          message: 'Educational background is required for students',
        });
      }
      if (!data.skills) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['skills'],
          message: 'Skills are required for students',
        });
      }
    } else if (data.role === 'doctor') {
      if (!data.organization) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['organization'],
          message: 'Organization name is required for doctors/employers',
        });
      }
      if (!data.bio) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bio'],
          message: 'Bio is required for doctors/employers',
        });
      }
      if (!data.expertise) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expertise'],
          message: 'Areas of expertise are required for doctors/employers',
        });
      }
    }
  });

// export type SignUpFormData = z.infer<typeof signUpSchema>;