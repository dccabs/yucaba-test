import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { supabase } from '../../../utils/initSupabase';

import { TODOS_CACHE_KEY } from './get';

const addTodo = async (text: string) => {
  if (!text) {
    throw new Error('must have text');
  }

  const { data: todo, error } = await supabase
    .from('todos')
    .insert([{ text }])
    .select('*');

  if (todo) {
    return todo[0];
  }

  if (error) {
    throw new Error(error.message);
  }
};

export const useAddTodoMutation = (
  onSuccess: (data: any) => void,
  onError: (e: any) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTodo,
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [TODOS_CACHE_KEY],
      });
      onSuccess(data);
    },
    onError,
  });
}
