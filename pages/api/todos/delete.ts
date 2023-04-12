import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../utils/initSupabase'
import { TodoResponseType, TodoType } from '@/helpers/common/types/todoType'
import { ErrorResponse } from '@/helpers/common/types/errorResponse'
import errorHandler from '@/helpers/api/errorHandler'
import { checkRequestMethod } from '@/helpers/client/checkRequestMethod'
import { deleteTodoValidationSchema } from '@/helpers/common/validationSchema/deleteTodoSchema'

interface CustomNextApiRequest extends NextApiRequest {
  body: {
    id: number
  }
}

const deleteTodo = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<{ todo: Pick<TodoType, 'id'> } | ErrorResponse>,
) => {
  try {
    const { id } = req.body

    checkRequestMethod(req.method)

    const parsedResult = deleteTodoValidationSchema.parse({ id })

    const { data: todo, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', parsedResult.id)
      .select('*')

    if (todo) {
      return res.status(200).json({
        todo: {
          id: todo[0].id,
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

export default deleteTodo
