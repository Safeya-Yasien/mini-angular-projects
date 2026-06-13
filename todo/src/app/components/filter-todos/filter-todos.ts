import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo';

@Component({
  selector: 'app-filter-todos',
  imports: [FormsModule],
  templateUrl: './filter-todos.html',
  styleUrl: './filter-todos.css',
})
export class FilterTodos {
  todoService = inject(TodoService);
  search: string = '';
  sort: string = 'date';
  status: string = 'all';

  onFilterChange() {
    this.todoService.setFilters(this.search, this.sort, this.status);
  }

  onResetFilters(){
    this.todoService.resetFilters()
  }
}
