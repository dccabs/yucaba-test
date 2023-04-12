import { supabase } from "../../../utils/initSupabase";

const getTodos = async (req: any, res: any) => {
  const { data: todos, error } = await supabase.from("todos").select("*");

  if (todos) {
    return res.status(200).json({ todos });
  }

  if (error) {
    return res.status(401).json({ error: { message: error.message } });
  }
};

export default getTodos;
