import { supabase } from "../../../utils/initSupabase";

const addTodo = async (req: any, res: any) => {
  const { text } = req.body;

  if (!text) {
    return res.status(401).json({ error: { message: "must have text" } });
  }

  const { data: todo, error } = await supabase
    .from("todos")
    .insert([{ text }])
    .select("*");

  if (todo) {
    return res.status(200).json({ todo: todo[0] });
  }

  if (error) {
    return res.status(401).json({ error: { message: error.message } });
  }
};

export default addTodo;
