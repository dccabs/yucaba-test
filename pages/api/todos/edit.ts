import { NextApiRequest, NextApiResponse } from 'next'

import { supabase } from '../../../utils/initSupabase'
import { TodoResponseType } from '@/helpers/common/types/todoType'
import { ErrorResponse } from '@/helpers/common/types/errorResponse'
import { editTodoValidationSchema } from '@/helpers/common/validationSchema/editTodoSchema'
import { checkRequestMethod } from '@/helpers/client/checkRequestMethod'
import errorHandler from '@/helpers/api/errorHandler'

interface CustomNextApiRequest extends NextApiRequest {
  body: {
    id: number
    text: string
  }
}

const addTodo = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<TodoResponseType | ErrorResponse>,
) => {
  try {
    const { id, text } = req.body

    checkRequestMethod(req.method)

    const parsedResult = editTodoValidationSchema.parse({ text, id })

    const { data: todo, error } = await supabase
      .from('todos')
      .upsert({ id, text: parsedResult.text })
      .select()

    if (todo) {
      return res.status(200).json({
        todo: {
          id: todo[0].id,
          text: todo[0].text,
          createdAt: todo[0].created_at,
        },
      })
    }

    if (error) {
      return res.status(401).json({ error: { message: error.message } })
    }
  } catch (error) {
    errorHandler(error, res)
  }
}

export default addTodo
