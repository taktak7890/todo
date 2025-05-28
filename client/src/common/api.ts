interface RequestInit {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

const server_address = `http://${window.location.hostname}:3000`;

/**
 * A utility function to make API requests.
 * @param endpoint - The API endpoint (relative to the base URL).
 * @param options - The fetch options (e.g., method, headers, body).
 * @returns A promise resolving to the JSON response.
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit,
): Promise<T> {
    const baseUrl = `${server_address}/api`;
    const url = `${baseUrl}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

export async function getApi<T>(api: string, params: Record<string, any>): Promise<T> {
    const query = new URLSearchParams(params).toString();
    const url = new URL(`${server_address}/todo${api}?${query}`);
    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.json();
}

export async function postApi<T>(api: string, params: Record<string, any>): Promise<T> {
    const url = new URL(`${server_address}/todo${api}`);
    const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    return res.json();
}

export async function putApi<T>(api: string, params: Record<string, any>): Promise<T> {
    const url = new URL(`${server_address}/todo${api}`);
    const res = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    return res.json();
}

export async function deleteApi<T>(api: string, params: Record<string, any>): Promise<T> {
    const url = new URL(`${server_address}/todo${api}`);
    const res = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    return res.json();
}


/**
 * Fetches a list of todos from the API.
 * @returns A promise resolving to an array of todos.
 */
export async function fetchTodos(params: { user_id: string }): Promise<Todo[]> {
    const res = await getApi<Todo[]>('/', params);
    return res;
}

/**
 * Adds a new todo to the API.
 * @param todo - The todo object to add.
 * @returns A promise resolving to the created todo.
 */
export async function addTodo(todo: addTodo): Promise<Todo> {
    const res = await postApi<Todo>('/', todo);
    return res;
}

/**
 * Updates an existing todo in the API.
 * @param id - The ID of the todo to update.
 * @param updates - The updates to apply to the todo.
 * @returns A promise resolving to the updated todo.
 */
export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const res = await putApi<Todo>(`/`, { todo_id: id, ...updates });
    return res;
}

/**
 * Deletes a todo from the API.
 * @param id - The ID of the todo to delete.
 * @returns A promise resolving to a success message.
 */
export async function deleteTodo(id: string): Promise<{ message: string }> {
    const res = await deleteApi<{ message: string }>(`/`, { todo_id: id });
    return res;
}

// Todo 型の定義
export interface Todo {
    todo_id: string;
    user_id: string;
    status: string;
    title: string;
    description: string;
    limit_date: string;
    create_tm: string;
}

export interface addTodo {
    title: string;
    description: string;
    limitDate?: Date | null;
    user: UserInfo;
}

export interface UserInfo {
    user_id: string;
}