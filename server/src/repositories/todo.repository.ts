import { PoolClient } from "pg";
import { UpdateTodo } from "../services/todo.service";
class ErrorUserNotFound extends Error {
    constructor() {
        super("User not found");
        this.name = "ErrorUserNotFound";
    }
}
type ErrorInfo = {
    name: string;
    message: string;
}



export class Todo {
    constructor(
        public todo_id: string,
        public user_id: string,
        public status: 'todo' | 'in_progress' | 'done',
        public title: string,
        public description: string | null,
        public create_tm: Date,
        public limitDate: Date | null,
    ) {
        this.todo_id = todo_id;
        this.user_id = user_id;
        this.title = title;
        this.status = status;
        this.description = description;
        this.create_tm = create_tm;
        this.limitDate = limitDate;
    }
}

export class TodoInsert {
    constructor(
        public user_id: string,
        public status: 'todo' | 'in_progress' | 'done',
        public title: string,
        public description: string,
        public limitDate?: Date | null,
    ) {
        this.user_id = user_id;
        this.title = title;
        this.status = status;
        this.description = description;
        this.limitDate = limitDate ?? null;
    }
}

export class TodoUpdate {
    constructor(
        public todo_id: string,
        public status: 'todo' | 'in_progress' | 'done',
    ) {
        this.todo_id = todo_id;
        this.status = status;
    }
}

export const insertTodo = async (client: PoolClient, todo: TodoInsert): Promise<Todo | ErrorInfo | void> => {
    const sql = `INSERT INTO todos (user_id, status, title, description, limit_date) VALUES ($1, $2, $3, $4, $5);`;
    const params = [
        todo.user_id,
        todo.status,
        todo.title,
        todo.description,
        todo.limitDate,
    ];
    const result = await client.query(sql, params);
    // return new Todo(
    //     result.rows[0].todo_id,
    //     result.rows[0].user_id,
    //     result.rows[0].status,
    //     result.rows[0].title,
    //     result.rows[0].description,
    //     result.rows[0].create_tm,
    //     result.rows[0].limitDate
    // );
}

export const updateTodo = async (client: PoolClient, todo: UpdateTodo): Promise<Todo | ErrorInfo | void> => {
    // const sql = `UPDATE todos SET status = $1, title = $2, description = $3, limit_date = $4 WHERE todo_id = $5;`;
    const sql = `UPDATE todos SET status = $1 WHERE todo_id = $2;`;
    const params = [
        todo.status,
        todo.todo_id,
    ];
    const result = await client.query(sql, params);
    if (result.rowCount === 0) {
        return { name: "ErrorTodoNotFound", message: "Todo not found" };
    }
    // return new Todo(
    //     todo.todo_id,
    //     todo.user_id,
    //     todo.status,
    //     todo.title,
    //     todo.description,
    //     todo.create_tm,
    //     todo.limitDate
    // );
}

export const deleteTodo = async (client: PoolClient, todoId: string): Promise<Todo | ErrorInfo | void> => {
    const sql = `DELETE FROM todos WHERE todo_id = $1;`;
    const params = [todoId];
    const result = await client.query(sql, params);
    if (result.rowCount === 0) {
        return { name: "ErrorTodoNotFound", message: "Todo not found" };
    }
}