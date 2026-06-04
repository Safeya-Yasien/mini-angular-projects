import { Component, computed, inject } from '@angular/core';
import { TodoService } from '../../services/todo';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  todoService = inject(TodoService);

  completedTasks = this.todoService.completed;
  pendingTasks = this.todoService.pending;
  inProgressTasks = this.todoService.inProgress;
}
