import { TodoType } from '@/helpers/common/types/todoType'
import {
  ReactNode,
  SetStateAction,
  createContext,
  useState,
  Dispatch,
  useMemo,
} from 'react'

type TodoContextState = {
  todos: TodoType[]
  setTodos: Dispatch<SetStateAction<TodoType[]>>
}

const initialState: TodoContextState = {
  todos: [],
  setTodos: () => {},
}

export const TodoContext = createContext<TodoContextState>(initialState)

type TodoContextProviderPropsType = {
  children: ReactNode
}

export const TodoContextProvider = ({
  children,
}: TodoContextProviderPropsType) => {
  const [todos, setTodos] = useState<TodoType[]>([])

  const propsValue = useMemo(() => ({ todos, setTodos }), [todos])

  return (
    <TodoContext.Provider value={propsValue}>{children}</TodoContext.Provider>
  )
}
