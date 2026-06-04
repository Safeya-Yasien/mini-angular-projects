import { Component } from '@angular/core';
import { TodoService } from '../../services/todo';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  imports: [FormsModule],
  templateUrl: './add-todo.html',
  styleUrl: './add-todo.css',
})
export class AddTodo {
  todoTitle: string = '';

  constructor(private todoService: TodoService) {}

  onSubmit() {
    if (this.todoTitle.trim()) {
      this.todoService.add(this.todoTitle);
      this.todoTitle = '';
    }
  }
}
