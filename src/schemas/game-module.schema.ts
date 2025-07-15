import { z } from 'zod';

export const gameModuleSchema = z.object({
  type: z.string().min(2, 'Le type est requis'),
  order: z.coerce.number().int().min(1, "L'ordre est requis"),
  config: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Config doit être un JSON valide' },
  ),
});

export type GameModuleFormValues = z.infer<typeof gameModuleSchema>;
