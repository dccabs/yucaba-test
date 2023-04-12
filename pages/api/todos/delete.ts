import { supabase } from "../../../utils/initSupabase";

const deleteTodo = async (req: any, res: any) => {
    const { id } = req.body;

    if (!id) {
        return res
            .status(401)
            .json({ error: { message: "must have id" } });
    }

    const { data: todo, error } = await supabase
        .from("todos")
        .delete()
        .eq('id', id)
        .select('*');

    if (todo) {
        return res.status(200).json({ todo: todo });
    }

    if (error) {
        return res.status(401).json({ error: { message: error.message } });
    }
};

export default deleteTodo;
