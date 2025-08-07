class TodoApp {
            constructor() {
                this.todos = [];
                this.currentFilter = 'all';
                this.editingId = null;
                
                this.todoInput = document.getElementById('todoInput');
                this.addBtn = document.getElementById('addBtn');
                this.todoList = document.getElementById('todoList');
                this.stats = document.getElementById('stats');
                this.filterBtns = document.querySelectorAll('.filter-btn');
                
                this.bindEvents();
                this.updateDisplay();
            }

            bindEvents() {
                this.addBtn.addEventListener('click', () => this.addTodo());
                this.todoInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTodo();
                });
                
                this.filterBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.currentFilter = e.target.dataset.filter;
                        this.updateFilterButtons();
                        this.updateDisplay();
                    });
                });
            }

            addTodo() {
                const text = this.todoInput.value.trim();
                if (!text) return;

                const todo = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    createdAt: new Date()
                };

                this.todos.unshift(todo);
                this.todoInput.value = '';
                this.updateDisplay();
                this.animateAdd();
            }

            toggleTodo(id) {
                const todo = this.todos.find(t => t.id === id);
                if (todo) {
                    todo.completed = !todo.completed;
                    this.updateDisplay();
                }
            }

            deleteTodo(id) {
                this.todos = this.todos.filter(t => t.id !== id);
                this.updateDisplay();
            }

            startEdit(id) {
                this.editingId = id;
                this.updateDisplay();
            }

            saveEdit(id, newText) {
                const todo = this.todos.find(t => t.id === id);
                if (todo && newText.trim()) {
                    todo.text = newText.trim();
                }
                this.editingId = null;
                this.updateDisplay();
            }

            cancelEdit() {
                this.editingId = null;
                this.updateDisplay();
            }

            getFilteredTodos() {
                switch (this.currentFilter) {
                    case 'active':
                        return this.todos.filter(todo => !todo.completed);
                    case 'completed':
                        return this.todos.filter(todo => todo.completed);
                    default:
                        return this.todos;
                }
            }

            updateFilterButtons() {
                this.filterBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
                });
            }

            updateStats() {
                const activeCount = this.todos.filter(todo => !todo.completed).length;
                const totalCount = this.todos.length;
                const completedCount = totalCount - activeCount;
                
                let statsText = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
                if (completedCount > 0) {
                    statsText += ` • ${completedCount} completed`;
                }
                
                this.stats.textContent = statsText;
            }

            createTodoElement(todo) {
                const isEditing = this.editingId === todo.id;
                
                return `
                    <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                               onchange="app.toggleTodo(${todo.id})">
                        
                        ${isEditing ? `
                            <input type="text" class="edit-input" value="${todo.text}" 
                                   onkeypress="if(event.key==='Enter') app.saveEdit(${todo.id}, this.value)"
                                   onblur="app.saveEdit(${todo.id}, this.value)" autofocus>
                            <button class="save-btn" onclick="app.saveEdit(${todo.id}, this.previousElementSibling.value)">Save</button>
                            <button class="cancel-btn" onclick="app.cancelEdit()">Cancel</button>
                        ` : `
                            <span class="todo-text">${todo.text}</span>
                            <div class="todo-actions">
                                <button class="edit-btn" onclick="app.startEdit(${todo.id})">Edit</button>
                                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
                            </div>
                        `}
                    </div>
                `;
            }

            updateDisplay() {
                const filteredTodos = this.getFilteredTodos();
                
                if (filteredTodos.length === 0) {
                    const emptyMessage = this.currentFilter === 'all' 
                        ? 'No todos yet. Add one above!'
                        : this.currentFilter === 'active'
                        ? 'No active todos!'
                        : 'No completed todos!';
                    
                    this.todoList.innerHTML = `
                        <div class="empty-state">
                            ${emptyMessage}
                        </div>
                    `;
                } else {
                    this.todoList.innerHTML = filteredTodos
                        .map(todo => this.createTodoElement(todo))
                        .join('');
                }
                
                this.updateStats();
            }

            animateAdd() {
                const firstTodo = this.todoList.querySelector('.todo-item');
                if (firstTodo) {
                    firstTodo.style.animation = 'none';
                    firstTodo.offsetHeight; // Trigger reflow
                    firstTodo.style.animation = 'fadeIn 0.3s ease-out';
                }
            }
        }

        // Initialize the app
        const app = new TodoApp();

        // Add some sample todos for demonstration
        setTimeout(() => {
            app.todos = [
                { id: 1, text: 'Welcome to your Todo App! 👋', completed: false, createdAt: new Date() },
                { id: 2, text: 'Try adding a new todo', completed: false, createdAt: new Date() },
                { id: 3, text: 'Check this one off when done', completed: true, createdAt: new Date() }
            ];
            app.updateDisplay();
        }, 100);
