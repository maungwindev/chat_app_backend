import { Pool } from 'pg';

const pool = new Pool({
    user:'postgres',
    password : '1234567890',
    host : '127.0.0.1',
    port : 5432,
    database:"chat_app"
});

export default pool; 