import { useMutation } from 'react-query'
import React, { useCallback, useContext, useEffect } from 'react'

import { TodoContext } from '@/context/TodoContext'
import { apiRequest } from '@/helpers/common/lib/axios'
import { TodoType } from '@/helpers/common/types/todoType'
import TodoItem from './TodoItem'
import LoadingText from '@/components/common/LoadingText'

type Todos = {
  todos: TodoType[]
}

const ListTodos = () => {
  const { todos, setTodos } = useContext(TodoContext)

  const todosMutationFn = async (): Promise<TodoType[]> => {
    const { todos } = await apiRequest<Todos>({
      method: 'POST',
      url: '/api/todos/get',
      data: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return todos
  }

  const { mutateAsync: getTodosMutationHandler, isLoading: isLoadingTodos } =
    useMutation({
      mutationKey: 'GET_TODO',
      mutationFn: todosMutationFn,
    })

  const fetchTodos = useCallback(async () => {
    const todos = await getTodosMutationHandler()
    setTodos([...todos])
  }, [])

  useEffect(() => {
    let mounted = true

    if (mounted) {
      fetchTodos()
    }

    return () => {
      mounted = false
    }
  }, [])

  if (isLoadingTodos) {
    return <LoadingText />
  }

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {todos &&
        todos.length > 0 &&
        todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </ul>
  )
}

export default ListTodos
