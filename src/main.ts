import './style.css'

// Structure of the data scheme
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// Load saved todos from local storage, or start with an empty list
const savedTodos = localStorage.getItem('todos')
let todos: Todo[] = []
if (savedTodos) {
    todos = JSON.parse(savedTodos) as Todo[]
}

// Saves the todos to local storage, so they are still there after a refresh
const saveTodos = ():void => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const todoInput = document.getElementById('todo-input') as HTMLInputElement
const todoForm = document.querySelector('.todo-form') as HTMLFormElement
const todoList = document.getElementById('todo-list') as HTMLUListElement 

const errorMessage = document.getElementById('error-message') as HTMLParagraphElement

const addTodo = (text:string):void => {
    const newTodo: Todo = {
        id: Date.now(), 
        text: text,
        completed: false
    }
    todos.push(newTodo)
    console.log(`Todo added: ${todos}`)

    renderTodos();
}

const renderTodos = ():void => {
    saveTodos()
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        // If the todo is completed, tick the checkbox and add the completed class
        let checked = ''
        if(todo.completed) {
            checked = 'checked'
            li.classList.add('completed')
        }

        li.innerHTML = `
            <input type="checkbox" ${checked}>
            <span>${todo.text}</span>
            <button>Remove</button>
        `
        addRemoveButtonListener(li, todo.id);
        addToggleListener(li, todo.id);
        todoList.appendChild(li);
    })
}

todoForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const text = todoInput.value.trim()

    if(text !== '') {
        todoInput.classList.remove('input-error')
        errorMessage.style.display = 'none'
        addTodo(text)
        todoInput.value = '' //Clears the input field after add:
    } else {
        todoInput.classList.add('input-error')
        errorMessage.style.display = 'block'
    }
})

const addRemoveButtonListener = (li:HTMLLIElement, id:number):void => {
    const removeButton = li.querySelector('button');
    removeButton?.addEventListener('click', () => removeTodo(id))
}

const removeTodo = (id:number):void => {
    todos = todos.filter(todo => todo.id !== id)
    renderTodos()
}

const addToggleListener = (li:HTMLLIElement, id:number):void => {
    const checkbox = li.querySelector('input');
    checkbox?.addEventListener('change', () => toggleTodo(id))
}

// Finds the todo and flips completed between true and false
const toggleTodo = (id:number):void => {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
        todo.completed = !todo.completed
    }
    renderTodos()
}

// Removes all todos from the list and from local storage
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement
clearButton.addEventListener('click', () => {
    todos = []
    renderTodos()
    localStorage.removeItem('todos')
})

// Draw the saved todos when the page loads - must be at the end so all functions exist
renderTodos();