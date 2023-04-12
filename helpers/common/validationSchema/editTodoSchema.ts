import { z } from 'zod'

export const editTodoValidationSchema = z.object({
  id: z.number().min(1),
  text: z.string().min(1).trim(),
})
