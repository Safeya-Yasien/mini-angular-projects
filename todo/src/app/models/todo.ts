type TodoStatus = 'pending' | 'completed' | 'in-progress';

export interface Todo {
  id: number;
  title: string;
  date: string;
  status: TodoStatus;
}
