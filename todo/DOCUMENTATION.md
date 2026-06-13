# شرح مفصل للمشروع - Todo App

---

## 1. هيكل المشروع

المشروع مبني على Angular وعنده:
- **Services**: بتتحكم في البيانات والـ state
- **Components**: بتعرض الـ UI
- **Models**: بتحدد شكل البيانات

---

## 2. الـ Model

```typescript
// models/todo.ts
export interface Todo {
  id: number;
  title: string;
  date: string;
  status: 'pending' | 'completed';
}
```

**ليه؟**
عشان نحدد شكل الـ Todo object، وكل مكان في المشروع يعرف الـ fields الموجودة فيه.

---

## 3. الـ TodoService

ده قلب المشروع، بيتحكم في كل البيانات والعمليات.

### الـ Signals

```typescript
todos = signal<Todo[]>(this.loadFromLocalStorage());
editingTodo = signal<Todo | null>(null);
search = signal('');
sort = signal('date');
status = signal('all');
```

**ليه Signals؟**
الـ Signal هو متغير Angular بيعرف لما قيمته تتغير وبيخبر الـ UI يتحدث تلقائياً من غير ما تعمل حاجة إضافية.

### الـ Computed

```typescript
completed = computed(() =>
  this.todos().filter(todo => todo.status === 'completed').length
);

pending = computed(() =>
  this.todos().filter(todo => todo.status === 'pending').length
);

filteredTodos = computed(() =>
  this.todos()
    .filter(todo =>
      this.search()
        ? todo.title.toLowerCase().includes(this.search().toLowerCase())
        : true
    )
    .filter(todo =>
      this.status() !== 'all' ? todo.status === this.status() : true
    )
    .sort((a, b) => {
      if (this.sort() === 'date')
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (this.sort() === 'name')
        return a.title.localeCompare(b.title);
      if (this.sort() === 'status')
        return a.status.localeCompare(b.status);
      return 0;
    })
);
```

**ليه Computed؟**
الـ `computed` بيحسب قيمته تلقائياً من signals تانية، ولما أي signal فيهم تتغير بيتحدث لوحده.

مثلاً `filteredTodos` بيعتمد على `todos`, `search`, `sort`, `status`، فأي تغيير في أي واحد منهم هيحدث الـ list تلقائياً.

### العمليات الأساسية

**Add:**
```typescript
add(todo: string) {
  const newTodo: Todo = {
    id: this.index++,
    title: todo,
    date: new Date().toLocaleDateString(),
    status: 'pending',
  };
  this.todos.update(todos => [...todos, newTodo]);
  localStorage.setItem('todos', JSON.stringify(this.todos()));
}
```
بتضيف todo جديد وبتحفظ في localStorage.

**Remove:**
```typescript
remove(id: number) {
  this.todos.update(todos => todos.filter(todo => todo.id !== id));
  localStorage.setItem('todos', JSON.stringify(this.todos()));
}
```
بتمسح الـ todo بالـ id وبتحدث localStorage.

**Update:**
```typescript
update(id: number, title: string) {
  this.todos.update(todos =>
    todos.map(todo => todo.id === id ? { ...todo, title } : todo)
  );
  this.editingTodo.set(null);
  localStorage.setItem('todos', JSON.stringify(this.todos()));
}
```
بتعدل عنوان الـ todo وبتوقف الـ edit mode.

**toggleStatus:**
```typescript
toggleStatus(id: number) {
  this.todos.update(todos =>
    todos.map(todo =>
      todo.id === id
        ? { ...todo, status: todo.status === 'pending' ? 'completed' : 'pending' }
        : todo
    )
  );
  localStorage.setItem('todos', JSON.stringify(this.todos()));
}
```
بتغير status الـ todo من pending لـ completed والعكس.

**setFilters:**
```typescript
setFilters(search: string, sort: string, status: string) {
  this.search.set(search);
  this.sort.set(sort);
  this.status.set(status);
}
```
بتحدث الـ filter signals، وبالتالي `filteredTodos` بيتحدث تلقائياً.

**resetFilters:**
```typescript
resetFilters() {
  this.search.set('');
  this.sort.set('date');
  this.status.set('all');
}
```
بترجع كل الفلاتر للقيم الافتراضية.

---

## 4. الـ Components

### FilterTodos Component

```typescript
export class FilterTodos {
  todoService = inject(TodoService);
  search: string = '';
  sort: string = 'date';
  status: string = 'all';

  onFilterChange() {
    this.todoService.setFilters(this.search, this.sort, this.status);
  }

  onResetFilters() {
    this.search = '';
    this.sort = 'date';
    this.status = 'all';
    this.todoService.resetFilters();
  }
}
```

**ليه عندنا متغيرات في الـ component والـ service معاً؟**
- متغيرات الـ component (`search`, `sort`, `status`) بتتحكم في الـ `[(ngModel)]` في الـ UI
- signals الـ service بتتحكم في الـ `filteredTodos`
- محتاجين الاتنين عشان الـ UI والـ data يتحدثوا مع بعض

**ليه `[(ngModel)]`؟**
الـ banana in a box هو two-way binding، يعني القيمة بتتحدث من الـ input للمتغير ومن المتغير للـ input في نفس الوقت.

**ليه `(ngModelChange)` مش `(change)`؟**
- `(change)` بيتفعل لما اليوزر يسيب الـ input
- `(ngModelChange)` بيتفعل مع كل حرف بيكتبه اليوزر، أفضل للـ search

### ListTodos Component

```typescript
export class ListTodos {
  todosService = inject(TodoService);
  todos = this.todosService.filteredTodos; // مش todos الأصلية!

  editTodo(todo: Todo) { this.todosService.edit(todo); }
  deleteTodo(id: number) { this.todosService.remove(id); }
  toggleStatus(id: number) { this.todosService.toggleStatus(id); }
}
```

**ليه `filteredTodos` مش `todos`؟**
عشان يعرض النتيجة بعد الفلترة والترتيب، لو استخدمنا `todos` الأصلية مش كان هيظهر أي تأثير للفلتر.

---

## 5. الـ localStorage

```typescript
loadFromLocalStorage() {
  return JSON.parse(localStorage.getItem('todos') || '[]');
}
```

بتجيب الـ todos المحفوظة لما التطبيق يفتح.
لو مفيش حاجة محفوظة بترجع array فارغة `[]`.

**ليه بنحفظ في localStorage؟**
عشان البيانات تفضل موجودة حتى لو اليوزر قفل المتصفح أو الصفحة، لأن Angular بيتشتغل في الـ memory بس، فلو مش حفظنا هنفقد البيانات.

---

## 6. الـ Flow الكامل للفلتر

```
اليوزر بيكتب في الـ search input
            ↓
[(ngModel)] بيحدث متغير search في الـ component
            ↓
(ngModelChange) بيستدعي onFilterChange()
            ↓
setFilters() في الـ service بيحدث searchSignal
            ↓
filteredTodos computed بيلاقي إن searchSignal اتغيرت
            ↓
بيعيد حساب نفسه تلقائياً
            ↓
list-todos بيعرض النتيجة الجديدة ✅
```

---

## 7. الفرق بين update وset وfind في الـ Signals

| Method | الاستخدام |
|--------|-----------|
| `signal.set(value)` | بتحط قيمة جديدة كلياً |
| `signal.update(fn)` | بتحدث بناءً على القيمة القديمة |

```typescript
// set - بتحط قيمة جديدة
this.search.set('');

// update - بتحدث بناءً على القديمة
this.todos.update(todos => [...todos, newTodo]);
```

---

## 8. ليه inject مش constructor؟

```typescript
// قديم
constructor(private todoService: TodoService) {}

// حديث ✅
todoService = inject(TodoService);
```

الـ `inject` هو الأسلوب الحديث في Angular 14+، أبسط وأوضح وبيشتغل برة الـ constructor كمان.