import { useState } from 'react';
import {
  PlusIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import { useAddTodoMutation } from './api/todos/add';
import { useEditTodoMutation } from './api/todos/edit';
import { useDeleteTodoMutation } from './api/todos/delete';
import { useGetTodos } from './api/todos/get';

import Loading from '@/components/Loading/Loading';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [updatedTodo, setUpdatedTodo] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const { data: todosData, isLoading, fetchStatus, isError } = useGetTodos();

  const onError = (error: string) => enqueueSnackbar(error, { variant: 'error' });

  const addTodo = useAddTodoMutation(
    () => {
      setNewTodo('');
      setLoading(false);
      enqueueSnackbar('Successfully added todo', { variant: 'success' });
    },
    onError,
  );

  const editTodo = useEditTodoMutation(
    () => {
      setEditId(null);
      setLoading(false);
      setUpdatedTodo('');
      enqueueSnackbar('Successfully updated todo', { variant: 'success' });
    },
    onError,
  );

  const deleteTodo = useDeleteTodoMutation(
    () => {
      setLoading(false);
      enqueueSnackbar('Successfully deleted todo', { variant: 'success' });
    },
    onError,
  );

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
        <div className="flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              value={newTodo}
              onChange={onChangeNewTodo}
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="New Todo"
              onKeyDown={onClickEnterInAdd}
            />
          </div>
          <button
            onClick={onClickAdd}
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Add
          </button>
        </div>
        {isLoading ? null : (
          <ul role="list" className="-mb-8 w-5/12">
            {todosData?.map((todo) => {
              return (
                <li key={todo.id} className="py-4">
                  <div className="flex space-x-3 flex items-center">
                    <span
                      className={classNames(
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-neutral-500'
                      )}
                    >
                      <ExclamationCircleIcon className="border-solid h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        {editId === todo.id ? (
                          <div className="mt-2 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <ArrowPathIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                value={updatedTodo}
                                onChange={onChangeExistingTodo}
                                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder={todo.text}
                                onKeyDown={onClickEnterInEdit(todo.id)}
                              />
                            </div>
                            <button
                              onClick={onClickSave(todo.id)}
                              type="button"
                              className="relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={onClickCancelUpdate}
                              type="button"
                              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-red-600 hover:text-neutral-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <h3
                              className="text-sm font-medium"
                              onClick={onClickEdit(todo.id, todo.text)}
                            >
                              {todo.text}
                            </h3>
                            <div className='flex gap-1'>
                              <span
                                className={classNames(
                                  'h-8 w-8 rounded-full flex items-center justify-center bg-gray-500 cursor-pointer'
                                )}
                                onClick={onClickEdit(todo.id, todo.text)}
                              >
                                <PencilIcon
                                  className="border-solid h-5 w-5 text-white" aria-hidden="true"
                                />
                              </span>
                              <span
                                className={classNames(
                                  'h-8 w-8 rounded-full flex items-center justify-center bg-red-500 cursor-pointer'
                                )}
                                onClick={onClickDelete(todo.id)}
                              >
                                <XMarkIcon
                                  className="border-solid h-5 w-5 text-white" aria-hidden="true"
                                />
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      {editId === todo.id ? null : (
                        <>
                          <p className="text-sm text-gray-500">
                            {formatDateCreated(todo.created_at)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul >
        )}
      </main >
    </>
  );
}
