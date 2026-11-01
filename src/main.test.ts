import { describe, it, expect } from 'vitest'

interface Todo {
    id: number
    text: string
    completed: boolean
}

const addTodo = (todos: Todo[], text: string) => {
    const newTodo: Todo = {
        id: 123,
        text,
        completed: false
    }
    return [...todos, newTodo]
}

const removeTodo = (todos: Todo[], id: number): Todo[] => {
    return todos.filter(todo => todo.id !== id)
}

describe('addTodo', () => {
    it('should add a new todo to the list', () => {
        const todos: Todo[] = [];
        const result = addTodo(todos, 'Test todo');
        expect(result.length).toBe(1);
        expect(result[0].text).toBe('Test todo');
        expect(result[0].completed).toBe(false);
    })
})

describe('removeTodo', () => {
    it('should remove a todo from the list', () => {
        const todos: Todo[] = [{ id: 1, text: 'Test todo', completed: false }];
        const result = removeTodo(todos, 1);
        expect(result.length).toBe(0);
    })
})

const isEmpty = (text: string): boolean => {
    return text.trim() === ''
}

describe('error message', () => {
    it('should see empty input as invalid', () => {
        expect(isEmpty('')).toBe(true);
        expect(isEmpty('   ')).toBe(true);
    })

    it('should see text as valid', () => {
        expect(isEmpty('Buy milk')).toBe(false);
    })
})