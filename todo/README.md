# ✅ Angular Todo App

A fully functional **CRUD Todo Application** built with **Angular 21**, featuring modern Angular APIs like Signals, `effect()`, `ViewChild`, and template-driven forms — with persistent storage via `localStorage`.

---

## 🚀 Live Demo

> _Add your deployed link here_

[Demo](./public/live.png)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── todo.ts                  # Todo interface
│   ├── services/
│   │   └── todo.service.ts          # Shared state & business logic
│   └── components/
│       ├── add-todo/
│       │   ├── add-todo.component.ts
│       │   └── add-todo.component.html
│       └── list-todos/
│           ├── list-todos.component.ts
│           └── list-todos.component.html
```

---

## 🧠 Concepts Used & Why

### 1. 📦 Services

```typescript
@Injectable({ providedIn: 'root' })
export class TodoService { ... }
```

**What it is:** A class decorated with `@Injectable` that Angular provides as a singleton across the app.

**Why I used it:** The app has two separate components — `AddTodo` and `ListTodos` — that both need to access and modify the same todo list. Instead of passing data between them using `@Input()` / `@Output()`, I put all the shared state and logic inside the service.

**When to use it:** Anytime multiple components need to share state or logic, use a service. It acts as the single source of truth.

---

### 2. ⚡ Signals

```typescript
todos = signal<Todo[]>(this.loadFromLocalStorage());
editingTodo = signal<Todo | null>(null);
```

**What it is:** A new reactive primitive introduced in Angular 16+. A signal holds a value and automatically notifies the UI when it changes.

**Why I used it:** Instead of using `BehaviorSubject` from RxJS or manual change detection, signals make state management simpler and more readable. The template updates automatically when a signal changes.

**When to use it:** Use signals for any state that the template needs to react to — like the list of todos, or which todo is currently being edited.

---

### 3. 🧮 Computed

```typescript
completed = computed(() => this.todos().filter((todo) => todo.status === 'completed').length);
pending = computed(() => this.todos().filter((todo) => todo.status === 'pending').length);
```

**What it is:** A derived signal — it automatically recalculates whenever its dependencies (other signals) change.

**Why I used it:** To show counts of completed and pending todos without manually tracking them. Whenever `todos` signal changes, `completed` and `pending` update automatically.

**When to use it:** Use `computed()` when you need a value that depends on another signal and should stay in sync automatically.

---

### 4. 🔁 `effect()`

```typescript
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
```

**What it is:** A function that runs automatically whenever the signals it reads change — similar to `useEffect` in React.

**Why I used it:** When the user clicks "Edit" on a todo in `ListTodos`, `editingTodo` signal gets updated inside the service. The `AddTodo` component needs to react to this change — filling the input and scrolling to it. `effect()` is the bridge that watches the signal and runs side effects.

**When to use it:** Use `effect()` when you need to run side effects (DOM manipulation, focus, scroll, logging) in response to signal changes.

> ⚠️ `setTimeout(() => {}, 0)` is used here to wait for Angular to finish updating the DOM before calling `focus()` and `scrollIntoView()`.

---

### 5. 🔍 ViewChild & Template Reference Variable

**Template:**

```html
<input #todoInput ... />
```

**Component:**

```typescript
@ViewChild('todoInput') todoInput!: ElementRef<HTMLInputElement>;
```

**What it is:** `#todoInput` is a **Template Reference Variable** — it gives a name to a DOM element inside the template. `@ViewChild` lets you access that element from the TypeScript component.

**Why I used it:** After clicking "Edit", I needed to scroll the page to the input and automatically focus it. This requires direct DOM access, which is exactly what `ViewChild` + `ElementRef` enables.

**When to use it:** Use `ViewChild` when you need to directly interact with a DOM element — like calling `.focus()`, `.scrollIntoView()`, or reading a native property.

---

### 6. 📋 Template-Driven Forms

```html
<form (ngSubmit)="onSubmit()">
  <input [(ngModel)]="todoTitle" name="todoTitle" required />
</form>
```

```typescript
import { FormsModule } from '@angular/forms';
```

**What it is:** A form approach in Angular where the form state lives in the template using `ngModel`.

**Why I used it:** The form is simple — just one input field. Template-driven forms are perfect for simple use cases and require less boilerplate than Reactive Forms.

**When to use it:** Use template-driven forms for simple forms. Use Reactive Forms for complex validation, dynamic fields, or form arrays.

---

### 7. 💾 localStorage

```typescript
localStorage.setItem('todos', JSON.stringify(this.todos()));
loadFromLocalStorage(): Todo[] {
  return JSON.parse(localStorage.getItem('todos') || '[]');
}
```

**What it is:** A browser API that stores data as key-value strings, persisted across page reloads.

**Why I used it:** To persist todos between sessions. Without it, todos disappear on every page refresh.

**When to use it:** For simple client-side persistence when you don't have a backend. For larger apps, use a database.

---

### 8. 🔄 CRUD Operations

| Operation  | Method              | Where Called                    |
| ---------- | ------------------- | ------------------------------- |
| **Create** | `add(title)`        | `AddTodo` on submit             |
| **Read**   | `todos` signal      | `ListTodos` template            |
| **Update** | `update(id, title)` | `AddTodo` on submit (edit mode) |
| **Delete** | `remove(id)`        | `ListTodos` delete button       |
| **Toggle** | `toggleStatus(id)`  | `ListTodos` checkbox            |

---

### 9. 💉 `inject()` vs Constructor Injection

**Constructor injection:**

```typescript
constructor(private todoService: TodoService) {}
```

**`inject()` function:**

```typescript
private todoService = inject(TodoService);
```

**What it is:** Two ways to inject dependencies in Angular. `inject()` is a newer functional API available in Angular 14+.

**Why I used both:** `inject()` is cleaner and works outside the constructor — useful inside `computed()`, `effect()`, or standalone functions. The constructor approach is the traditional way and still valid.

**When to use `inject()`:** Prefer it in standalone components, functional guards, or when you want cleaner code without constructor boilerplate.

---

### 10. 🔗 Shared State Pattern (editingTodo)

```typescript
editingTodo = signal<Todo | null>(null);

// In ListTodos — sets the todo being edited
edit(todo: Todo) {
  this.editingTodo.set(todo);
}

// In AddTodo — reads and reacts to it
effect(() => {
  const editing = this.todoService.editingTodo();
  this.todoTitle = editing ? editing.title : '';
});
```

**Why I used it:** `AddTodo` and `ListTodos` are sibling components — they don't have a parent-child relationship. The `editingTodo` signal inside the service acts as a shared communication channel between them, avoiding prop drilling or event emitter chains.

**Flow:**

```
User clicks Edit (ListTodos)
  → editingTodo.set(todo)
  → effect() in AddTodo fires
  → input fills + button changes to "Update"

User submits form (AddTodo)
  → update(id, newTitle)
  → editingTodo.set(null)
  → UI resets to "Add" mode
```

---

## 🛠️ Tech Stack

| Technology  | Version |
| ----------- | ------- |
| Angular     | 21      |
| TypeScript  | Latest  |
| TailwindCSS | 3+      |

---

## 🏃 Getting Started

```bash
# Clone the repository
git clone https://github.com/Safeya-Yasien/mini-angular-projects/tree/master/todo.git

# Install dependencies
npm install

# Run the development server
ng serve

# Open in browser
http://localhost:4200
```

---

## ✨ Features

- ➕ Add new tasks
- ✏️ Edit existing tasks (with auto-scroll & focus)
- 🗑️ Delete tasks
- ✅ Toggle task status (pending / completed)
- 💾 Persistent storage via localStorage
- 📊 Live count of completed and pending tasks
- 📱 Responsive design with TailwindCSS

---

## 👩‍💻 Author

**Safeya Yasien**

- Portfolio: [safeya-yasien.netlify.app](https://safeya-yasien.netlify.app)
- GitHub: [@Safeya-Yasien](https://github.com/Safeya-Yasien)
- LinkedIn: [safeya-yasien](https://www.linkedin.com/in/safeya-yasien-2ba9b4260/)

- search
- filter
- sort
