import { Selector, ClientFunction } from 'testcafe'

// The elements from index.html that the tests use
const todoInput = Selector('#todo-input')
const addButton = Selector('.todo-form button')
const todoItems = Selector('.todo-item')
const errorMessage = Selector('#error-message')
const progressText = Selector('#progress-text')
const clearButton = Selector('#clear-btn')
const clearCompletedButton = Selector('#clear-completed-btn')
const colorPicker = Selector('#colorPicker')

// Picks a color in the color picker, the same way the "input" event does in the browser
const pickColor = ClientFunction((color) => {
    const picker = document.getElementById('colorPicker')
    picker.value = color
    picker.dispatchEvent(new Event('input'))
})

// Reads the background color of the page
const getBackgroundColor = ClientFunction(() => document.body.style.backgroundColor)

// Reloads the page, the same as pressing F5
const reloadPage = ClientFunction(() => window.location.reload())

fixture('To-do app')
    .page('http://localhost:5173')

// -Add todo

test('Add: a new todo shows up in the list', async t => {
    await t
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
        .expect(todoItems.count).eql(1)
        .expect(todoItems.nth(0).find('span').innerText).eql('Buy milk')
})

test('Add: the input is empty after adding', async t => {
    await t
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
        .expect(todoInput.value).eql('')
})

// -Remove todo

test('Remove: the todo disappears from the list', async t => {
    await t
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
        .click(todoItems.nth(0).find('.remove-btn'))
        .expect(todoItems.count).eql(0)
})

test('Remove: only the clicked todo is removed', async t => {
    await t
        .typeText(todoInput, 'Todo A')
        .click(addButton)
        .typeText(todoInput, 'Todo B')
        .click(addButton)
        .click(todoItems.nth(0).find('.remove-btn'))
        .expect(todoItems.count).eql(1)
        .expect(todoItems.nth(0).find('span').innerText).eql('Todo B')
})

// -Error message

test('Error: an empty todo shows the error message', async t => {
    await t
        .click(addButton)
        .expect(errorMessage.visible).ok()
        .expect(todoInput.hasClass('input-error')).ok()
        .expect(todoItems.count).eql(0)
})

test('Error: the error disappears after adding a real todo', async t => {
    await t
        .click(addButton)
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
        .expect(errorMessage.visible).notOk()
        .expect(todoInput.hasClass('input-error')).notOk()
})

// -Toggle completed

test('Toggle: the checkbox marks a todo as completed', async t => {
    await t
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
        .click(todoItems.nth(0).find('input'))
        .expect(todoItems.nth(0).hasClass('completed')).ok()
})

test('Toggle: clicking the checkbox again undoes it', async t => {
    await t
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
        .click(todoItems.nth(0).find('input'))
        .click(todoItems.nth(0).find('input'))
        .expect(todoItems.nth(0).hasClass('completed')).notOk()
})

// -Local storage

test('Local storage: todos are still there after a refresh', async t => {
    await t
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
    await reloadPage()
    await t
        .expect(todoItems.count).eql(1)
        .expect(todoItems.nth(0).find('span').innerText).eql('Buy milk')
})

test('Local storage: completed status is still there after a refresh', async t => {
    await t
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
        .click(todoItems.nth(0).find('input'))
    await reloadPage()
    await t.expect(todoItems.nth(0).hasClass('completed')).ok()
})

// -Clear all

test('Clear all: every todo is removed', async t => {
    await t
        .typeText(todoInput, 'Todo A')
        .click(addButton)
        .typeText(todoInput, 'Todo B')
        .click(addButton)
        .click(clearButton)
        .expect(todoItems.count).eql(0)
})

test('Clear all: the list stays empty after a refresh', async t => {
    await t
        .typeText(todoInput, 'Buy milk')
        .click(addButton)
        .click(clearButton)
    await reloadPage()
    await t.expect(todoItems.count).eql(0)
})

// -Progress bar

test('Progress: starts at 0 with no todos', async t => {
    await t.expect(progressText.innerText).eql('0 of 0 completed (0%)')
})

test('Progress: shows 50% when half of the todos are completed', async t => {
    await t
        .typeText(todoInput, 'Todo A')
        .click(addButton)
        .typeText(todoInput, 'Todo B')
        .click(addButton)
        .click(todoItems.nth(0).find('input'))
        .expect(progressText.innerText).eql('1 of 2 completed (50%)')
})

// -Color picker

test('Color picker: picking a color changes the background', async t => {
    await pickColor('#ff0000')
    await t.expect(getBackgroundColor()).eql('rgb(255, 0, 0)')
})

test('Color picker: the color is still there after a refresh', async t => {
    await pickColor('#ff0000')
    await reloadPage()
    await t
        .expect(getBackgroundColor()).eql('rgb(255, 0, 0)')
        .expect(colorPicker.value).eql('#ff0000')
})

// -Edit todo

test('Edit: the todo gets the new text', async t => {
    await t
        .typeText(todoInput, 'Old text')
        .click(addButton)
        .setNativeDialogHandler(() => 'New text') // answers the prompt with "New text"
        .click(todoItems.nth(0).find('.edit-btn'))
        .expect(todoItems.nth(0).find('span').innerText).eql('New text')
})

test('Edit: clicking Cancel keeps the old text', async t => {
    await t
        .typeText(todoInput, 'Old text')
        .click(addButton)
        .setNativeDialogHandler(() => null) // null means the user clicked Cancel
        .click(todoItems.nth(0).find('.edit-btn'))
        .expect(todoItems.nth(0).find('span').innerText).eql('Old text')
})

// -Clear completed

test('Clear completed: only completed todos are removed', async t => {
    await t
        .typeText(todoInput, 'Todo A')
        .click(addButton)
        .typeText(todoInput, 'Todo B')
        .click(addButton)
        .click(todoItems.nth(0).find('input'))
        .click(clearCompletedButton)
        .expect(todoItems.count).eql(1)
        .expect(todoItems.nth(0).find('span').innerText).eql('Todo B')
})

test('Clear completed: todos that are not completed stay in the list', async t => {
    await t
        .typeText(todoInput, 'Todo A')
        .click(addButton)
        .click(clearCompletedButton)
        .expect(todoItems.count).eql(1)
})