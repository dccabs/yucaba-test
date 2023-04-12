import { NextApiRequest, NextApiResponse } from 'next'
import { MethodNotAllowed } from 'http-errors'

import { supabase } from '../../../utils/initSupabase'
import errorHandler from '@/helpers/api/errorHandler'

import { addTodoValidationSchema } from '@/helpers/common/validationSchema/addTodoSchema'
import { TodoResponseType, TodoType } from '@/helpers/common/types/todoType'
import { ErrorResponse } from '@/helpers/common/types/errorResponse'
import { checkRequestMethod } from '@/helpers/client/checkRequestMethod'

interface CustomNextApiRequest extends NextApiRequest {
  body: {
    text: string
  }
}

const addTodo = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<TodoResponseType | ErrorResponse>,
) => {
  try {
    const { text } = req.body

    checkRequestMethod(req.method)

    const parsedResult = addTodoValidationSchema.parse({ text })

    const { data: todo, error } = await supabase
      .from('todos')
      .insert([{ text: parsedResult.text }])
      .select('*')

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
