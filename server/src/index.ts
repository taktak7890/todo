import express from 'express';
import cors from 'cors';
import todoRoute from './routes/todo.route';

const app = express();
const port = 3000;

// PostgreSQL 接続設定
try {
    app.use(express.json());
    app.use(cors());
    app.use((req, res, next) => {
        console.log(`------------------------------------------------------------------------------------------------`);
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        if (req.method === 'GET') {
            console.log(`Request Params: ${JSON.stringify(req.params)}`);
            console.log(`Request Query: ${JSON.stringify(req.query)}`);
        } else {
            console.log(`Request Body: ${JSON.stringify(req.body)}`);
        }
        next();
    });
    app.use('/todo', todoRoute);

    app.listen(port, () => {
        console.log(`サーバー起動 http://localhost:${port}`);
    });
} catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // エラーが発生した場合はプロセスを終了
}
