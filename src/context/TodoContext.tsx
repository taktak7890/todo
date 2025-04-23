import React, { createContext, useContext, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../common/common';

export type Todo = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    limitDate?: Date; // 期限は任意
};

export type ReturnTodo = Todo & {
    isOverdue: boolean; // 期限切れかどうか
};

// Context の型定義
type TodoContextType = {
    getTodos: () => Todo[];
    addTodo: (todo: Todo, addFront?: boolean) => void;
    deleteTodo: (id: string) => void;
    completedTodo: (id: string) => void;
};

// Context の初期値
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Context プロバイダー
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        // 初期化時にローカルストレージからデータを取得
        const storedTodos = getLocalStorage('todos');
        return storedTodos ? JSON.parse(storedTodos) : [];
    });

    // ローカルストレージに保存する関数
    const saveTodosToLocalStorage = (todos: Todo[]) => {
        setLocalStorage('todos', JSON.stringify(todos)); // localStorageに保存
    };

    const addTodo: TodoContextType['addTodo'] = (todo, addFront) => {
        const updatedTodos = addFront
            ? [todo, ...todos] // 先頭に追加
            : [...todos, todo]; // 末尾に追加

        setTodos(updatedTodos);
        saveTodosToLocalStorage(updatedTodos); // ローカルストレージに保存
    };

    const deleteTodo: TodoContextType['deleteTodo'] = (id) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        saveTodosToLocalStorage(updatedTodos); // ローカルストレージに保存
    };

    const completedTodo: TodoContextType['completedTodo'] = (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
        saveTodosToLocalStorage(updatedTodos); // ローカルストレージに保存
    };

    const getTodos = (): ReturnTodo[] => {
        const storedTodos = getLocalStorage('todos');

        const ret = storedTodos ? JSON.parse(storedTodos) : [];
        return ret.map((todo: Todo) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
            limitDate: todo.limitDate ? new Date(todo.limitDate) : todo.limitDate,
            isOverdue: todo.limitDate ? new Date(todo.limitDate) < new Date() : false, // 期限切れかどうか
        }));
    }


    return (
        <TodoContext.Provider value={{ getTodos, addTodo, deleteTodo, completedTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

// Context を利用するカスタムフック
export const useTodoContext = (): TodoContextType => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodoContext must be used within a TodoProvider');
    }
    return context;
};