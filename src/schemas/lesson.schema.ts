import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string().min(2, 'Le titre est requis'),
  description: z.string().min(2, 'La description est requise'),
  order: z.coerce.number().int().min(1, "L'ordre est requis"),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
