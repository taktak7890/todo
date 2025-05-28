import { transaction } from "../repositories/repository";
import * as db_todo from "../repositories/todo.repository";
export interface UserInfo {
    user_id: string;
}
export interface AddTodo {
    title: string;
    description: string;
    limitDate?: Date | null;
    user: UserInfo;
};
export interface UpdateTodo {
    todo_id: string;
    status: 'todo' | 'in_progress' | 'done';
}


export const getTodoList = async (userId: string) => {
    try {
        const todos = await transaction(async (client) => {
            const result = await client.query(
                `SELECT * FROM todos WHERE user_id = $1 ORDER BY todo_id DESC;`,
                [userId]
            );
            return result.rows;
        });
        return todos;
    } catch (error) {
        console.error('Error fetching todo list:', error);
        throw error;
    }
}

export const addTodo = async (todo: AddTodo) => {
    try {
        const ret = await transaction(async (client) => {
            const params = new db_todo.TodoInsert(
                todo.user.user_id,
                'todo', // 初期状態は 'todo'
                todo.title,
                todo.description,
                todo.limitDate ? todo.limitDate : null, // limitDate が指定されていない場合は null を設定
            );
            const result = await db_todo.insertTodo(client, params);
            if (result instanceof Error) {
                throw result;
            }
            return result
        });
        return { result: true };
    } catch (error) {
        console.error('Error saving todo:', error);
        throw error;
    }
}

export const updateTodo = async (todo: UpdateTodo) => {
    try {
        const ret = await transaction(async (client) => {
            const params = {
                todo_id: todo.todo_id,
                status: todo.status,
            };
            const result = await db_todo.updateTodo(client, params);
            if (result instanceof Error) {
                throw result;
            }
            return result
        });
        return { result: true };
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
}

export const deleteTodo = async (todoId: string) => {
    try {
        const ret = await transaction(async (client) => {
            const result = await db_todo.deleteTodo(client, todoId);
            if (result instanceof Error) {
                throw result;
            }
            return result
        });
        return { result: true };
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
}