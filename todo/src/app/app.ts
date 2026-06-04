import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListTodos } from "./components/list-todos/list-todos";
import { AddTodo } from "./components/add-todo/add-todo";
import { FilterTodos } from "./components/filter-todos/filter-todos";
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";

@Component({
  selector: 'app-root',
  imports: [ListTodos, AddTodo, FilterTodos, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('todo');
}
