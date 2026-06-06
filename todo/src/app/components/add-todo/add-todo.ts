import { Component, effect, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('todoInput') todoInput!: ElementRef<HTMLInputElement>;

  constructor(private todoService: TodoService) {
    effect(() => {
      const editing = this.todoService.editingTodo();
      this.todoTitle = editing ? editing.title : '';

      if (editing) {
        setTimeout(() => {
          this.todoInput.nativeElement.focus();
          this.todoInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
      }
    });
  }

  get isEditing() {
    return this.todoService.editingTodo();
  }

  cancelEdit() {
    this.todoService.editingTodo.set(null);
    this.todoTitle = '';
  }

  onSubmit() {
    if (!this.todoTitle.trim()) return;

    if (this.isEditing) {
      this.todoService.update(this.isEditing.id, this.todoTitle);
    } else {
      this.todoService.add(this.todoTitle.trim());
    }

    this.todoTitle = '';
  }
}
