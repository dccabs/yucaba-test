import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../utils/initSupabase';

import { TODOS_CACHE_KEY } from './get';

type EditTodoType = {
  id: number;
  text: string;
};

const editTodo = async ({ id, text }: EditTodoType) => {
  if (!text || !id) {
    throw new Error('must have text and id');
  }

  const { data: todo, error } = await supabase
    .from('todos')
    .upsert({ id, text })
    .select();

  if (todo) {
    return todo[0];
  }

  if (error) {
    throw new Error(error.message);
  }
};

export const useEditTodoMutation = (
  onSuccess: (data: any) => void,
  onError: (e: any) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editTodo,
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [TODOS_CACHE_KEY],
      });
      onSuccess(data);
    },
    onError,
  });
}