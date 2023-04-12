export type TodoType = {
  id: number
  createdAt: Date
  text: string
}

export type TodoResponseType = {
  todo: TodoType
}
