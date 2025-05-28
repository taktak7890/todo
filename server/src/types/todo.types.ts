export interface UserInfo {
    user_id: string;
}

export interface BaseTodo {
    title: string;
    description: string;
    limitDate?: Date | null;
}

// リクエスト用型
export interface AddTodoRequest extends BaseTodo {
    user: UserInfo;
}