import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/20/solid'
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import Loading from '@/components/Loading/Loading';

type EditTodoType = {
  id: number,
  text: string,
}

const TODOS_CACHE_KEY = 'todos';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [updatedTodo, setUpdatedTodo] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const onError = (error: string) => {
    setLoading(false);
    enqueueSnackbar(error, { variant: 'error' });
  }

  const { data: todosData, isLoading, fetchStatus, isError } = useQuery({
    queryKey: [TODOS_CACHE_KEY],
    queryFn: async () => {
      const api = await fetch("/api/todos/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (api.ok) {
        const data = await api.json();
        return data?.todos;
      }
      if (api.status === 401) {
        throw "Error 401";
      }
    }
  });

  const addTodo = useMutation({
    mutationFn: async (text: string) => {
      const api = await fetch("/api/todos/add", {
        method: "POST",
        body: JSON.stringify({ text: text }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (api.ok) {
        console.log('add success');
      }
      if (api.status === 401) {
        throw "Error 401";
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TODOS_CACHE_KEY]
      })
      setNewTodo('');
      setLoading(false);
      enqueueSnackbar('Successfully added todo', { variant: 'success' });
    },
    onError,
  });

  const editTodo = useMutation({
    mutationFn: async ({ text, id }: EditTodoType) => {
      const api = await fetch("/api/todos/edit", {
        method: "POST",
        body: JSON.stringify({ text, id }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (api.ok) {
        console.log('edit success');
      }
      if (api.status === 401) {
        throw "Error 401";
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TODOS_CACHE_KEY]
      })
      setEditId(null);
      setLoading(false);
      setUpdatedTodo('');
      enqueueSnackbar('Successfully updated todo', { variant: 'success' });
    },
    onError,
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: number) => {
      const api = await fetch("/api/todos/delete", {
        method: "POST",
        body: JSON.stringify({ id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (api.ok) {
        console.log('add success');
      }
      if (api.status === 401) {
        throw "Error 401";
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TODOS_CACHE_KEY]
      })
      setLoading(false);
      enqueueSnackbar('Successfully deleted todo', { variant: 'success' });
    },
    onError,
  });

  const formatDateCreated = (date: string) => {
    const newDate = new Date(date);
    const daysjsDate = dayjs(newDate);
    const formatted = daysjsDate.format('MMM D, YYYY h:MM A').toString();
    return formatted;
  }

  const onClickAdd = () => {
    if (!newTodo) {
      onError('Please enter a task');
      return;
    }
    setLoading(true);
    addTodo.mutate(newTodo);
  }

  const onClickSave = (id: number) => () => {
    if (!updatedTodo) {
      onError('Please enter a task');
      return;
    }
    setLoading(true);
    editTodo.mutate({ id, text: updatedTodo });
  }

  const onClickEnterInAdd = (event: any) => {
    if (event.key === 'Enter') {
      if (!newTodo) {
        onError('Please enter a task');
        return;
      }
      setLoading(true);
      addTodo.mutate(newTodo);
    }
  }

  const onClickEnterInEdit = (id: number) => (event: any) => {
    if (event.key === 'Enter') {
      if (!updatedTodo) {
        onError('Please enter a task');
        return;
      }
      setLoading(true);
      editTodo.mutate({ id, text: updatedTodo });
    }
  }

  const onClickDelete = (id: number) => () => {
    setLoading(true);
    deleteTodo.mutate(id);
  }

  const onClickEdit = (id: number, text: string) => () => {
    setUpdatedTodo(text);
    setEditId(id);
  }

  const onClickCancelUpdate = () => setEditId(null);

  const onChangeNewTodo = (event: any) => setNewTodo(event.target.value);

  const onChangeExistingTodo = (event: any) => setUpdatedTodo(event.target.value);

  if (isError) {
    onError('Something went wrong');
  }

  return (
    <>
      <main className="max-w-5xl mx-auto p-10 space-y-4 flex items-center justify-center flex-col">
        <Loading loading={loading || isLoading || fetchStatus === 'fetching'} />
        <div className="max-w-lg w-full mx-auto bg-white shadow-md rounded-md overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-medium">Todo List</h2>
            <div className="mt-4 flex">
              <input
                value={newTodo}
                onChange={onChangeNewTodo}
                className="border-gray-300 rounded-md px-4 py-2 mr-2 flex-grow"
                placeholder="Add new todo"
                onKeyDown={onClickEnterInAdd}
              />
              <button
                onClick={onClickAdd}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
              >
                Add
              </button>
            </div>
          </div>
          {isLoading ? null : (
            <ul className="divide-y divide-gray-300">
              {todosData?.map((todo: any) => (
                <li key={todo.id} className="p-4 flex items-center">
                  {editId === todo.id ? (
                    <>
                      <input
                        value={updatedTodo}
                        onChange={onChangeExistingTodo}
                        className="border-gray-300 rounded-md px-4 py-2 mr-2 flex-grow"
                        placeholder={todo.text}
                        onKeyDown={onClickEnterInEdit(todo.id)}
                      />
                      <button
                        onClick={onClickSave(todo.id)}
                        className="text-gray-500 hover:text-gray-700 mr-2"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={onClickCancelUpdate}
                        className="text-gray-500 hover:text-gray-700 mr-2"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className="flex-grow"
                        onClick={onClickEdit(todo.id, todo.text)}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={onClickEdit(todo.id, todo.text)}
                        className="text-gray-500 hover:text-gray-700 mr-2"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={onClickDelete(todo.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div >
      </main >
    </>
  );
}
