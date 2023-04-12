import { NextApiRequest, NextApiResponse } from 'next'

import { supabase } from '../../../utils/initSupabase'
import { TodoType } from '@/helpers/common/types/todoType'
import errorHandler from '@/helpers/api/errorHandler'
import { ErrorResponse } from '@/helpers/common/types/errorResponse'
import { checkRequestMethod } from '@/helpers/client/checkRequestMethod'

const getTodos = async (
  req: NextApiRequest,
  res: NextApiResponse<{ todos: TodoType[] } | ErrorResponse>,
) => {
  try {
    const { data: todos, error } = await supabase.from('todos').select('*')

    checkRequestMethod(req.method)

    if (todos) {
      return res.status(200).json({ todos })
    }

    if (error) {
      return res.status(401).json({ error: { message: error.message } })
    }
  } catch (error) {
    errorHandler(error, res)
  }
}

export default getTodos
