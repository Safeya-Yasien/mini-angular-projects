import { computed, Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos = signal<Todo[]>(this.loadFromLocalStorage());
  index: number = this.todos().length + 1;
  editingTodo = signal<Todo | null>(null);

  search = signal('');
  sort = signal('date');
  status = signal('all');

  completed = computed(() => this.todos().filter((todo) => todo.status === 'completed').length);
  pending = computed(() => this.todos().filter((todo) => todo.status === 'pending').length);
  filteredTodos = computed(() =>
    this.todos()
      .filter((todo) =>
        this.search() ? todo.title.toLowerCase().includes(this.search().toLowerCase()) : true,
      )
      .filter((todo) => (this.status() !== 'all' ? todo.status === this.status() : true))
      .sort((a, b) => {
        if (this.sort() === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (this.sort() === 'name') return a.title.localeCompare(b.title);
        if (this.sort() === 'status') return a.status.localeCompare(b.status);

        return 0;
      }),
  );

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

  setFilters(search: string, sort: string, status: string) {
    this.search.set(search);
    this.sort.set(sort);
    this.status.set(status);
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

  resetFilters() {
    this.search.set('');
    this.sort.set('date');
    this.status.set('all');
  }
}
