type TodoStatus = 'pending' | 'completed';

export interface Todo {
  id: number;
  title: string;
  date: string;
  status: TodoStatus;
}
