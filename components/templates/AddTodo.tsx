import React, { useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  AddTodoRequestType,
  addTodoValidationSchema,
} from '@/helpers/common/validationSchema/addTodoSchema'
import { useMutation } from 'react-query'
import { apiRequest } from '@/helpers/common/lib/axios'
import { TodoResponseType } from '@/helpers/common/types/todoType'
import { TodoContext } from '@/context/TodoContext'

const AddTodo = () => {
  const { setTodos } = useContext(TodoContext)
  const {
    register,
    handleSubmit,
    reset: formReset,
  } = useForm<AddTodoRequestType>({
    resolver: zodResolver(addTodoValidationSchema),
  })

  const addTodoMutationFn = async (text: string): Promise<TodoResponseType> => {
    const result = await apiRequest<TodoResponseType>({
      method: 'POST',
      url: '/api/todos/add',
      data: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return result
  }

  const { mutateAsync: addTodoMutationHandler, isLoading } = useMutation({
    mutationKey: 'ADD_TODO',
    mutationFn: addTodoMutationFn,
  })

  const onAddTodoHandler: SubmitHandler<
    AddTodoRequestType
  > = async formData => {
    const { todo } = await addTodoMutationHandler(formData.text)
    if (todo) {
      setTodos(prevState => [...prevState, todo])
      formReset()
    }
  }

  return (
    <form onSubmit={handleSubmit(onAddTodoHandler)}>
      <div>
        <label
          htmlFor="todo"
          className="block text-lg font-medium leading-6 text-gray-900">
          Add New Todo
        </label>
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
            disabled={isLoading}>
            Save
          </button>
        </div>
      </div>
    </form>
  )
}

export default AddTodo
