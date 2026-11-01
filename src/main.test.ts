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

const toggleTodo = (todos: Todo[], id: number): Todo[] => {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
        todo.completed = !todo.completed
    }
    return todos
}

describe('toggleTodo', () => {
    it('should mark a todo as completed', () => {
        const todos: Todo[] = [{ id: 1, text: 'Test todo', completed: false }];
        const result = toggleTodo(todos, 1);
        expect(result[0].completed).toBe(true);
    })

    it('should mark a completed todo as not completed', () => {
        const todos: Todo[] = [{ id: 1, text: 'Test todo', completed: true }];
        const result = toggleTodo(todos, 1);
        expect(result[0].completed).toBe(false);
    })
})

const saveTodos = (todos: Todo[]): void => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const loadTodos = (): Todo[] => {
    const saved = localStorage.getItem('todos')
    if (saved) {
        return JSON.parse(saved) as Todo[]
    }
    return []
}

describe('local storage', () => {
    it('should save and load todos', () => {
        const todos: Todo[] = [{ id: 1, text: 'Test todo', completed: true }];
        saveTodos(todos);
        const result = loadTodos();
        expect(result[0].text).toBe('Test todo');
        expect(result[0].completed).toBe(true);
    })

    it('should return an empty list when nothing is saved', () => {
        localStorage.clear();
        const result = loadTodos();
        expect(result.length).toBe(0);
    })
})

const getProgress = (todos: Todo[]): number => {
    if (todos.length === 0) {
        return 0
    }
    const completed = todos.filter(todo => todo.completed).length
    return Math.round((completed / todos.length) * 100)
}

describe('progress bar', () => {
    it('should be 0 when there are no todos', () => {
        expect(getProgress([])).toBe(0);
    })

    it('should be 50 when half of the todos are completed', () => {
        const todos: Todo[] = [
            { id: 1, text: 'Todo A', completed: true },
            { id: 2, text: 'Todo B', completed: false }
        ];
        expect(getProgress(todos)).toBe(50);
    })
})