import type * as Express from "express";
import type * as Service from "../services/todo.service";

import * as service from "../services/todo.service";
import { Router } from "express";

const router = Router();

type ReqPost<T> = Express.Request<{}, {}, T>;
type ReqGet<T> = Express.Request<{}, {}, {}, T>;
type Res<T> = Express.Response<T>;

// ルートエンドポイントの確認用レスポンス
router.get("/working", (req: ReqGet<{}>, res) => {
    res.status(200).json({ message: "Todo API is working" });
});

// Todoリストの取得
router.get("/", async (req: ReqGet<{
    user_id: string;
}>, res) => {
    try {
        const userId = req.query.user_id;
        const todos = await service.getTodoList(userId);
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todo list:', error);
        res.status(500).json({ error: 'Failed to fetch todo list' });
    }
});

// Todoの追加
router.post("/", async (req: ReqPost<{
    user: Service.UserInfo;
    title: string;
    description: string;
    limitDate?: Date | null;
}>, res) => {
    try {
        const todo = req.body;
        const result = await service.addTodo(todo);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error saving todo:', error);
        res.status(500).json({ error: 'Failed to save todo' });
    }
    res.status(201).json();
});

// Todoの更新
router.put("/", async (req: ReqPost<{
    user: Service.UserInfo;
    todo_id: string;
    status: 'todo' | 'in_progress' | 'done';
}>, res) => {
    try {
        const todo = req.body; // リクエストボディから Todo を取得
        const result = await service.updateTodo(todo); // Todo を更新するサービスを呼び出す
        res.status(200).json(result); // 成功した場合は 200 ステータスコードでレスポンス
        // res.status(200).json({ message: "Todo updated" }); // テスト用のレスポンス
    }
    catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
}
);

// Todoの削除
router.delete("/", async (req: ReqPost<{
    user: Service.UserInfo;
    todo_id: string;
}>, res) => {
    try {
        const todoId = req.body.todo_id;
        const result = await service.deleteTodo(todoId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

export default router;