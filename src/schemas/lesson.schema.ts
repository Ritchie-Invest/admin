import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string().min(2, 'Le titre est requis'),
  description: z.string().min(2, 'La description est requise'),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
