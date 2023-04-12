import { z } from 'zod'

export const deleteTodoValidationSchema = z.object({
  id: z.number().min(1),
})
