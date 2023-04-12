import React, { useContext } from 'react'
import { useMutation } from 'react-query'

import { apiRequest } from '@/helpers/common/lib/axios'
import { TodoType } from '@/helpers/common/types/todoType'
import { TodoContext } from '@/context/TodoContext'

type DeleteTodoResponse = {
  todo: Pick<TodoType, 'id'>
}

type DeleteTodoPropsType = {
  todoId: number
}

const DeleteTodo = ({ todoId }: DeleteTodoPropsType) => {
  const { setTodos } = useContext(TodoContext)

  const deleteTodoMutationFn = async (
    todoId: number,
  ): Promise<DeleteTodoResponse> => {
    const result = await apiRequest<DeleteTodoResponse>({
      method: 'POST',
      url: '/api/todos/delete',
      data: JSON.stringify({ id: todoId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return result
  }

  const { mutateAsync: deleteTodoMutationHandler, isLoading: isDeletingTodo } =
    useMutation({
      mutationKey: 'DELETE_TODO',
      mutationFn: deleteTodoMutationFn,
    })

  const onDeleteTodoHandler = async () => {
    const response = await deleteTodoMutationHandler(todoId)
    setTodos(prevState =>
      prevState.filter(state => state.id !== response.todo.id),
    )
  }

  return (
    <button
      className="text-red-500 text-sm font-medium"
      onClick={onDeleteTodoHandler}
      disabled={isDeletingTodo}>
      {isDeletingTodo ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export default DeleteTodo
