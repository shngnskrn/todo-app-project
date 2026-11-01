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

const progressBar = document.getElementById('progress-bar') as HTMLDivElement
const progressText = document.getElementById('progress-text') as HTMLParagraphElement

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
    updateProgress()
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

// Updates the progress bar to show how many todos are completed
const updateProgress = ():void => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length

    let percent = 0
    if (total > 0) {
        percent = Math.round((completed / total) * 100)
    }

    progressBar.style.width = percent + '%'
    progressText.textContent = `${completed} of ${total} completed (${percent}%)`
}

// Removes all todos from the list and from local storage
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement
clearButton.addEventListener('click', () => {
    todos = []
    renderTodos()
    localStorage.removeItem('todos')
})

// Function to change the background color of the page based on the color picker value
const changeBackgroundColor = (color: string): void => {
    document.body.style.backgroundColor = color
    localStorage.setItem('backgroundColor', color) // NEW: save the color
}

// Function to initialize the color picker event listener
const initializeColorPicker = (): void => {
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement
    if (colorPicker) {
        // NEW: load the saved color when the page starts
        const savedColor = localStorage.getItem('backgroundColor')
        if (savedColor) {
            changeBackgroundColor(savedColor)
            colorPicker.value = savedColor
        }

        colorPicker.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement
            changeBackgroundColor(target.value)
        })
    } else {
        console.error('Color picker element not found')
    }
}

// Call the initializeColorPicker function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeColorPicker()
})

// Draw the saved todos when the page loads - must be at the end so all functions exist
renderTodos();