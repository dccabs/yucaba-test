import { supabase } from "../../../utils/initSupabase";

const addTodo = async (req, res) => {
  const { id, text } = req.body;

  if (!text || !id) {
    return res
      .status(401)
      .json({ error: { message: "must have text and id" } });
  }

  const { data: todo, error } = await supabase
    .from("todos")
    .upsert({ id, text })
    .select();

  if (todo) {
    return res.status(200).json({ todo: todo[0] });
  }

  if (error) {
    return res.status(401).json({ error: { message: error.message } });
  }
};

export default addTodo;
