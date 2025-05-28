
import { Pool, PoolClient } from 'pg'; // PostgreSQL 用の Pool をインポート
const pool = new Pool({
    user: 'neondb_owner', // PostgreSQL ユーザー名
    host: 'ep-lucky-breeze-a10fskf2.ap-southeast-1.aws.neon.tech',     // ホスト名
    database: 'neondb', // データベース名
    password: 'npg_Rh2JoAg5jmrO', // パスワード
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // SSL 証明書の検証を無効化
    },
});

export const query = async (query: string, params: any[]) => {
    try {
        const res = await pool.query(query, params);
        return res.rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Database query error');
    }
}

export const transaction = async (callback: (client: PoolClient) => Promise<any>) => {
    const client = await pool.connect(); // データベースに接続
    let ret = null;
    try {
        await client.query('BEGIN'); // トランザクションを開始
        ret = await callback(client); // コールバック関数を実行
        await client.query('COMMIT'); // コミット
    } catch (err) {
        console.error('Transaction error:', err);
        await client.query('ROLLBACK'); // ロールバック
    } finally {
        client.release(); // 接続を解放
    }
    return ret;
}
