import { NextApiRequest, NextApiResponse } from 'next'

import { supabase } from '../../../utils/initSupabase'
import { TodoType } from '@/helpers/common/types/todoType'
import errorHandler from '@/helpers/api/errorHandler'
import { ErrorResponse } from '@/helpers/common/types/errorResponse'
import { checkRequestMethod } from '@/helpers/client/checkRequestMethod'

type Todos = {
  todos: TodoType[]
}

const getTodos = async (
  req: NextApiRequest,
  res: NextApiResponse<Todos | ErrorResponse>,
) => {
  try {
    const { data: todos, error } = await supabase.from('todos').select('*')

    checkRequestMethod(req.method)

    if (todos) {
      const newTodos = todos.map(todo => {
        return {
          id: todo.id,
          text: todo.text,
          createdAt: todo.created_at,
        }
      })
      return res.status(200).json({ todos: newTodos })
    }

    if (error) {
      return res.status(401).json({ error: { message: error.message } })
    }
  } catch (error) {
    errorHandler(error, res)
  }
}

export default getTodos
