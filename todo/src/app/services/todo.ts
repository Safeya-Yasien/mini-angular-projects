import { computed, Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos = signal<Todo[]>(this.loadFromLocalStorage());
  index: number = this.todos().length + 1;
  editingTodo = signal<Todo | null>(null);

  completed = computed(() => this.todos().filter((todo) => todo.status === 'completed').length);
  pending = computed(() => this.todos().filter((todo) => todo.status === 'pending').length);

  constructor() {}

  loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
  }

  add(todo: string) {
    const newTodo: Todo = {
      id: this.index++,
      title: todo,
      date: new Date().toLocaleDateString(),
      status: 'pending',
    };

    this.todos.update((todos) => [...todos, newTodo]);
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }

  edit(todo: Todo) {
    this.editingTodo.set(todo);
  }

  update(id: number, title: string) {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, title: title } : todo)),
    );

    this.editingTodo.set(null);
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }

  remove(id: number) {
    this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }

  getAll() {
    return this.todos();
  }

  toggleStatus(id: number) {
    this.todos.update((todos) => {
      return todos.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === 'pending' ? 'completed' : 'pending' }
          : todo,
      );
    });
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }
}
