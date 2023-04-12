import AddTodo from '@/components/templates/AddTodo'
import ListTodos from '@/components/templates/ListTodos'

export default function Test() {
  return (
    <>
      <main className="max-w-5xl mx-auto p-10 space-y-4">
        <AddTodo />
        <ListTodos />
      </main>
    </>
  )
}
