import { useEffect, useState } from "react";
import { formatDateTime } from "../common/common";
import { CmnSwitch } from "../components/CmnSwitch";
import { CustomInput } from '../components/CustomInput';
import { FormControlLabel, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Paper, Typography, Box, Input, FormLabel } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import type { Todo } from "../common/api";
import * as api from "../common/api";
import { CmnForm } from "../components/CmnForm";
import { CmnButton } from "../components/CmnButton";
const css_header: SxProps<Theme> = {
    backgroundColor: '#f0f0f0',
    margin: '10px',
}

type ShowTodoList = Todo & {
    completed: boolean;
}

// TODO表示用ページコンポーネント   
export const TODO: React.FC = (props) => {
    const [searchParams, setSearchParams] = useSearchParams(); // クエリパラメータを管理
    // const [addFront, toggleAddFront] = useReducer((s, _t) => !s, false); // フォームのリファレンスを作成
    const hiddenCompleted = searchParams.get('hiddenCompleted') === 'true'; // 完了を非表示にするかどうか
    const [formState, setFormState] = useState({ title: '', description: '', limit_date: '' }); // フォームの状態を管理
    const [todos, setTodos] = useState<ShowTodoList[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const toggleShowCompleted = () => {
        const newHiddenCompleted = !hiddenCompleted;
        setSearchParams({ hiddenCompleted: String(newHiddenCompleted) }); // クエリパラメータを更新
    };

    const completedTodo = async (todo_id: string) => {
        const todo = todos.find(todo => todo.todo_id === todo_id);
        if (todo) {
            const updatedTodo = { ...todo, completed: !todo.completed };
            setTodos(todos.map(t => (t.todo_id === todo_id ? updatedTodo : t)));
            await api.updateTodo(todo_id, { status: updatedTodo.completed ? 'done' : 'todo' });
        }
    }

    const deleteTodo = async (todo_id: string) => {
        if (window.confirm('本当に削除しますか？')) {
            // APIを呼び出してTodoを削除する処理を追加
            await api.deleteTodo(todo_id);
        }
        fetchTodos();
    }

    const fetchTodos = async () => {
        const todos = await api.fetchTodos({ user_id: '1' });
        setTodos(todos.map(todo => ({ ...todo, completed: todo.status === 'done' }))); // APIからTodoを取得
    }

    useEffect(() => {
        fetchTodos();
    }, []);

    const OnButton_addTodo: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement; // 型を HTMLFormElement に指定
        const title = (form.elements.namedItem("title") as HTMLInputElement).value;
        const description = (form.elements.namedItem("description") as HTMLInputElement).value;
        const limitDate = (form.elements.namedItem("limit_date") as HTMLInputElement).value;

        const todo: api.addTodo = {
            title,
            description,
            limitDate: limitDate ? new Date(limitDate) : null, // 日付が指定されていない場合は null を設定
            user: { user_id: '1' }, // ユーザー情報を追加
        };
        await api.addTodo(todo); // APIを呼び出してTodoを追加
        fetchTodos(); // Todoリストを再取得

        setFormState({ title: '', description: '', limit_date: '' }); // フォームをリセット

    }

    return (<>
        <Typography variant="h4">Todo</Typography>
        {/* <button onClick={() => {
            loading.setLoading(true);
        }}>TEST</button>
        <button onClick={() => {
            loading.setLoading(false);
        }}>TEST2</button> */}
        <Box>
            <CmnForm onSubmit={OnButton_addTodo}>
                <Box>
                    <FormLabel>期限(任意)</FormLabel>
                    <Input type="date" name="limit_date"
                        value={formState.limit_date}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box>
                    <CustomInput type="text" name="title" placeholder="タイトル" required
                        value={formState.title}
                        onChange={handleInputChange}
                    />
                    <CustomInput type="text" name="description" placeholder="内容" required
                        value={formState.description}
                        onChange={handleInputChange}
                    />
                </Box>
                {/* <Box>
                    <FormLabel>上に追加</FormLabel>
                    <Checkbox name="addFront" checked={addFront} onChange={toggleAddFront} />
                    <Button type="submit" color="primary" variant="outlined">Add Todo</Button>
                </Box> */}
            </CmnForm>
        </Box>
        <Box>
            <FormControlLabel
                control={<CmnSwitch checked={hiddenCompleted} onChange={toggleShowCompleted} />}
                label="完了を非表示"
                sx={{ margin: '10px' }}
            ></FormControlLabel>
            <h2>Todo List({todos.filter(v => v.completed).length}/{todos.length})</h2>
            {
                todos.length === 0 && <p>Todoがありません</p>
            }
            <TableContainer component={Paper} sx={{ maxHeight: '400px', overflow: 'auto', border: '1px solid black' }}>
                <Table stickyHeader sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ ...css_header, width: '60px', textAlign: 'center' }}>削除</TableCell>
                            <TableCell sx={{ ...css_header, width: '60px', textAlign: 'center' }}>完了</TableCell>
                            <TableCell sx={{ ...css_header }}>タイトル</TableCell>
                            <TableCell sx={{ ...css_header }}>内容</TableCell>
                            <TableCell sx={{ ...css_header }}>期限</TableCell>
                            <TableCell sx={{ ...css_header }}>作成日時</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todos.filter(todo => !hiddenCompleted || !todo.completed).map((todo) => (
                            <TableRow key={todo.todo_id} sx={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                                <TableCell>
                                    <CmnButton onClick={() => deleteTodo(todo.todo_id)}>X</CmnButton>
                                </TableCell>
                                <TableCell>
                                    <CmnSwitch checked={todo.completed} onChange={() => completedTodo(todo.todo_id)} />
                                </TableCell>
                                <TableCell>
                                    {todo.title}
                                </TableCell>
                                <TableCell>{todo.description}</TableCell>
                                <TableCell>{formatDateTime(new Date(todo.limit_date))}</TableCell>
                                <TableCell>
                                    {formatDateTime(new Date(todo.create_tm))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>);
}