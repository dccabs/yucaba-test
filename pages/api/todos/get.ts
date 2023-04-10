import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../utils/initSupabase';

export const TODOS_CACHE_KEY = 'todos';

export const useGetTodos = () => {
  return useQuery({
    queryKey: [TODOS_CACHE_KEY],
    queryFn: async () => {
      const { data, error } = await supabase.from('todos').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  })
};

