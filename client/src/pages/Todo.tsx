import { useEffect, useReducer, useState } from "react";
import { formatDateTime } from "../common/common";
import { Todo, useTodoContext } from "../context/TodoContext";
import { CmnSwitch } from "../components/CmnSwitch";
import { CustomInput } from '../components/CustomInput';
import { Button, FormControlLabel, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Paper, Typography, Box, Input, Checkbox, FormLabel } from "@mui/material";
import { useSearchParams } from "react-router-dom";
const css_header: SxProps<Theme> = {
    backgroundColor: '#f0f0f0',
    margin: '10px',
}

// TODO表示用ページコンポーネント   
export const TODO: React.FC = (props) => {
    const { getTodos, addTodo, deleteTodo, completedTodo } = useTodoContext();
    const todos = getTodos(); // Todoリストを取得
    const [searchParams, setSearchParams] = useSearchParams(); // クエリパラメータを管理
    const [addFront, toggleAddFront] = useReducer((s, _t) => !s, false); // フォームのリファレンスを作成
    const hiddenCompleted = searchParams.get('hiddenCompleted') === 'true'; // 完了を非表示にするかどうか
    const [formState, setFormState] = useState({ title: '', description: '', limit_date: '' }); // フォームの状態を管理

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const toggleShowCompleted = () => {
        const newHiddenCompleted = !hiddenCompleted;
        setSearchParams({ hiddenCompleted: String(newHiddenCompleted) }); // クエリパラメータを更新
    };

    const OnButton_addTodo: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement; // 型を HTMLFormElement に指定
        const title = (form.elements.namedItem("title") as HTMLInputElement).value;
        const description = (form.elements.namedItem("description") as HTMLInputElement).value;
        const limitDate = (form.elements.namedItem("limit_date") as HTMLInputElement).value;

        const newTodo: Todo = {
            id: Date.now().toString(),
            title,
            description,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            limitDate: limitDate ? new Date(limitDate) : undefined,
        };
        addTodo(newTodo, addFront);
        setFormState({ title: '', description: '', limit_date: '' }); // フォームをリセット
    }

    return (<>
        <Typography variant="h4">Todo</Typography>
        <Box>
            <form onSubmit={OnButton_addTodo}>
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
                <Box>
                    <FormLabel>上に追加</FormLabel>
                    <Checkbox name="addFront" checked={addFront} onChange={toggleAddFront} />
                    <Button type="submit" color="primary" variant="outlined">Add Todo</Button>
                </Box>
            </form>
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
                            <TableRow key={todo.id} sx={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                                <TableCell>
                                    <Button onClick={() => deleteTodo(todo.id)}>X</Button>
                                </TableCell>
                                <TableCell>
                                    <CmnSwitch checked={todo.completed} onChange={() => completedTodo(todo.id)} />
                                </TableCell>
                                <TableCell>
                                    {todo.title}
                                </TableCell>
                                <TableCell>{todo.description}</TableCell>
                                <TableCell>{formatDateTime(todo.limitDate)}</TableCell>
                                <TableCell>
                                    {formatDateTime(todo.createdAt)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>);
}