import './style.css'

/**
 * Structure of the data scheme
 * Every todo must have an id, a text and a completed status.\
 */
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// -Local Storage

// Load saved todos from local storage, or start with an empty list
const savedTodos = localStorage.getItem('todos')
let todos: Todo[] = []
if (savedTodos) {
    todos = JSON.parse(savedTodos) as Todo[]
}

/**
 * Saves the todos to local storage, so they are still there after a refresh.
 * Local storage can only store text, so JSON.stringify turns the array into text.
 */
const saveTodos = ():void => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

// -HTML Elements

// Get the elements from index.html. "as ..." tells TypeScript what type of element it is (typecasting)
const todoInput = document.getElementById('todo-input') as HTMLInputElement
const todoForm = document.querySelector('.todo-form') as HTMLFormElement
const todoList = document.getElementById('todo-list') as HTMLUListElement 

const errorMessage = document.getElementById('error-message') as HTMLParagraphElement

const progressBar = document.getElementById('progress-bar') as HTMLDivElement
const progressText = document.getElementById('progress-text') as HTMLParagraphElement

// -Adding, removing and toggling todos

/**
 * Creates a new todo and adds it to the list.
 * @param text - the text the user typed in
 */
const addTodo = (text:string):void => {
    const newTodo: Todo = {
        id: Date.now(), // the current time in milliseconds is used as a unique id
        text: text,
        completed: false
    }
    todos.push(newTodo)
    console.log(`Todo added: ${todos}`)

    renderTodos();
}

/**
 * Draws the whole todo list on the page.
 * It is called after every change, so it also saves the todos and updates the progress bar.
 */
const renderTodos = ():void => {
    saveTodos()
    updateProgress()
    todoList.innerHTML = ''; // clear the old list before drawing it again

    // Make one <li> for every todo
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
            <button class="edit-btn">Edit</button>
            <button class="remove-btn">Remove</button>
        `
        
        // Give the checkbox and buttons in this <li> their click listeners
        addRemoveButtonListener(li, todo.id);
        addToggleListener(li, todo.id);
        addEditButtonListener(li, todo.id);
        todoList.appendChild(li);
    })
}

// -Form submission and input validation

// Runs when the user clicks "Add" or presses Enter
todoForm.addEventListener('submit', (event: Event) => {
    event.preventDefault(); // stop the page from reloading

    const text = todoInput.value.trim() // trim removes spaces at the start and end

    if(text !== '') {
        // Valid input: hide the error and add the todo
        todoInput.classList.remove('input-error')
        errorMessage.style.display = 'none'
        addTodo(text)
        todoInput.value = '' //Clears the input field after add:
    } else {
        // Empty input: show the red border and the error message
        todoInput.classList.add('input-error')
        errorMessage.style.display = 'block'
    }
})

// -Removing, toggling and editing todos

/**
 * Adds a click listener to the Remove button of one todo.
 * @param li - the list item the button is in
 * @param id - the id of the todo
 */
const addRemoveButtonListener = (li:HTMLLIElement, id:number):void => {
    const removeButton = li.querySelector('.remove-btn');
    removeButton?.addEventListener('click', () => removeTodo(id)) // ?. = only if the button exists
}

/**
 * Removes a todo by keeping every todo except the one with this id.
 * @param id - the id of the todo to remove
 */
const removeTodo = (id:number):void => {
    todos = todos.filter(todo => todo.id !== id)
    renderTodos()
}

// -Toggle completed

/**
 * Adds a change listener to the checkbox of one todo.
 * @param li - the list item the checkbox is in
 * @param id - the id of the todo
 */
const addToggleListener = (li:HTMLLIElement, id:number):void => {
    const checkbox = li.querySelector('input');
    checkbox?.addEventListener('change', () => toggleTodo(id))
}

/**
 * Finds the todo and flips completed between true and false.
 * @param id - the id of the todo to toggle
 */
const toggleTodo = (id:number):void => {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
        todo.completed = !todo.completed // ! turns true into false and false into true
    }
    renderTodos()
}

// -Edit todo

/**
 * Adds a click listener to the Edit button of one todo.
 * @param li - the list item the button is in
 * @param id - the id of the todo
 */
const addEditButtonListener = (li:HTMLLIElement, id:number):void => {
    const editButton = li.querySelector('.edit-btn');
    editButton?.addEventListener('click', () => editTodo(id))
}

/**
 * Asks the user for new text and updates the todo.
 * prompt returns string | null - null means the user clicked Cancel.
 * @param id - the id of the todo to edit
 */
const editTodo = (id:number):void => {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
        const text = prompt('Edit todo', todo.text)
        if (text && text.trim() !== '') { // don't save if "Cancel" was clicked or the text is empty
            todo.text = text.trim()
            renderTodos()
        }
    }
}

// -Progress bar

/**
 * Updates the progress bar to show how many todos are completed.
 */
const updateProgress = ():void => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length // count only completed todos

    // Start at 0 so we never divide by 0 when the list is empty
    let percent = 0
    if (total > 0) {
        percent = Math.round((completed / total) * 100)
    }

    progressBar.style.width = percent + '%' // how much of the bar is green
    progressText.textContent = `${completed} of ${total} completed (${percent}%)`
}

// -Clear all todos

// Removes all todos from the list and from local storage
const clearButton = document.getElementById('clear-btn') as HTMLButtonElement
clearButton.addEventListener('click', () => {
    todos = []
    renderTodos()
    localStorage.removeItem('todos')
})

// -Color picker

// Started in class - I added saving and loading the color with local storage

/**
 * Changes the background color of the page and saves it in local storage.
 * @param color - the color from the color picker, e.g. "#ff0000"
 */
const changeBackgroundColor = (color: string): void => {
    document.body.style.backgroundColor = color
    localStorage.setItem('backgroundColor', color) // save the color
}

/**
 * Sets up the color picker: loads the saved color and listens for new colors.
 */
const initializeColorPicker = (): void => {
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement
    if (colorPicker) {
        // Load the saved color when the page starts
        const savedColor = localStorage.getItem('backgroundColor')
        if (savedColor) {
            changeBackgroundColor(savedColor)
            colorPicker.value = savedColor
        }

        // "input" runs every time the color changes, so the page updates live
        colorPicker.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement // typecasting the event target
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

// -Startup

// Draw the saved todos when the page loads - must be at the end so all functions exist
renderTodos();