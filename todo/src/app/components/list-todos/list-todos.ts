import { Component } from '@angular/core';
import { TodoService } from '../../services/todo';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-list-todos',
  imports: [],
  templateUrl: './list-todos.html',
  styleUrl: './list-todos.css',
})
export class ListTodos {
  todos;

  constructor(private todoService: TodoService) {
    this.todos = this.todoService.todos;
  }

  editTodo(todo: Todo) {
    this.todoService.edit(todo);
  }

  deleteTodo(id: number) {
    this.todoService.remove(id);
  }

  toggleStatus(id: number) {
    this.todoService.toggleStatus(id);
  }
}
