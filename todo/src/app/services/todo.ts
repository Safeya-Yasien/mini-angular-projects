import { computed, Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos = signal<Todo[]>(this.loadFromLocalStorage());
  index: number = this.todos().length + 1;

  completed = computed(() => this.todos().filter((todo) => todo.status === 'completed').length);
  pending = computed(() => this.todos().filter((todo) => todo.status === 'pending').length);
  inProgress = computed(() => this.todos().filter((todo) => todo.status === 'in-progress').length);

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

  update(todo: Todo) {}

  remove(id: number) {
    this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }

  getAll() {
    return this.todos();
  }
}
