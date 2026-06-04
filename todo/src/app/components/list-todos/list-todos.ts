import { Component } from '@angular/core';
import { TodoService } from '../../services/todo';

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

  editTodo(id: number) {}

  deleteTodo(id: number) {
    this.todoService.remove(id);
  }
}
