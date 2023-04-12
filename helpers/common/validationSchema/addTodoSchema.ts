import { z } from 'zod'

export const addTodoValidationSchema = z.object({
  text: z.string().min(1).trim(),
})
