import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../utils/initSupabase';

import { TODOS_CACHE_KEY } from './get';

const deleteTodo = async (id: string | number) => {
    if (!id) {
        throw new Error("must have id");
    }

    const { data: todo, error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id)
        .select("*");

    if (todo) {
        return todo;
    }

    if (error) {
        throw new Error(error.message);
    }
}

export const useDeleteTodoMutation = (
    onSuccess: (data: any) => void,
    onError: (e: any) => void,
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: [TODOS_CACHE_KEY],
            });
            onSuccess(data);
        },
        onError,
    });
}