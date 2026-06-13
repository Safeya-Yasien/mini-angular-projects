import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-list-todos',
  imports: [],
  templateUrl: './list-todos.html',
  styleUrl: './list-todos.css',
})
export class ListTodos {
  todosService = inject(TodoService);
  todos = this.todosService.filteredTodos;

  editTodo(todo: Todo) {
    this.todosService.edit(todo);
  }

  deleteTodo(id: number) {
    this.todosService.remove(id);
  }

  toggleStatus(id: number) {
    this.todosService.toggleStatus(id);
  }
}
