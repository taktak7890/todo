import express from 'express';
import { Pool } from 'pg'; // PostgreSQL 用の Pool をインポート

const app = express();
const port = 3000;

// PostgreSQL 接続設定
const pool = new Pool({
    user: 'neondb_owner', // PostgreSQL ユーザー名
    host: 'ep-lucky-breeze-a10fskf2.ap-southeast-1.aws.neon.tech',     // ホスト名
    database: 'neondb', // データベース名
    password: 'npg_Rh2JoAg5jmrO', // パスワード
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // SSL 証明書の検証を無効化（必要に応じて調整）
    },         // PostgreSQL のデフォルトポート
});

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example API route
app.get('/api/todo', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos'); // `todos` テーブルからデータを取得
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data from database');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});