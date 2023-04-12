import { TodoContext } from '@/context/TodoContext'
import { apiRequest } from '@/helpers/common/lib/axios'
import { TodoResponseType, TodoType } from '@/helpers/common/types/todoType'
import React, { useContext, useState } from 'react'
import { useMutation } from 'react-query'
import DeleteTodo from './DeleteTodo'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  EditTodoRequestType,
  editTodoValidationSchema,
} from '@/helpers/common/validationSchema/editTodoSchema'
import EditTodo from './EditTodo'

type PropsType = {
  todo: TodoType
}

const TodoItem = ({ todo }: PropsType) => {
  const [isEditingTodo, setIsEditingTodo] = useState(false)
  const { setTodos } = useContext(TodoContext)
  const {
    register,
    handleSubmit,
    setValue: setInputValue,
  } = useForm<EditTodoRequestType>({
    resolver: zodResolver(editTodoValidationSchema),
  })

  const editTodoMutationFn = async ({
    id,
    text,
  }: EditTodoRequestType): Promise<TodoResponseType> => {
    const result = await apiRequest<TodoResponseType>({
      method: 'POST',
      url: '/api/todos/edit',
      data: JSON.stringify({ id, text }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return result
  }

  const { mutateAsync: editTodoMutationHandler, isLoading: isUpdatingTodo } =
    useMutation({
      mutationKey: 'EDIT_TODO',
      mutationFn: editTodoMutationFn,
    })

  const onEditTodoHandler: SubmitHandler<
    EditTodoRequestType
  > = async formData => {
    const { todo } = await editTodoMutationHandler(formData)
    if (todo) {
      setTodos(prevState =>
        prevState.map(state => {
          if (state.id === todo.id) {
            return {
              ...state,
              text: todo.text,
            }
          }
          return state
        }),
      )
      setIsEditingTodo(false)
    }
  }

  const onEditBtnHandler = (todo: TodoType) => {
    setIsEditingTodo(true)
    setInputValue('text', todo.text)
    setInputValue('id', todo.id)
  }

  const onCancel = () => {
    setIsEditingTodo(false)
  }

  return (
    <li className="flex justify-between py-4">
      {!isEditingTodo ? (
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{todo.text}</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(todo.createdAt).toDateString()}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onEditTodoHandler)}>
          <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                {...register('text')}
              />
            </div>
            <button
              type="submit"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled={isUpdatingTodo}>
              {isUpdatingTodo ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      )}
      <div>
        <DeleteTodo todoId={todo.id} />
        <EditTodo
          isEditingTodo={isEditingTodo}
          onCancel={() => onCancel()}
          onEdit={() => onEditBtnHandler(todo)}
        />
      </div>
    </li>
  )
}

export default TodoItem
