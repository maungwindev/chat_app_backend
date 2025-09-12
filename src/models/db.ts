import { Pool } from 'pg';

// const pool = new Pool({
//     user:'chatdb_wnr3_user',
//     password : 'Bg5WD2gayHUX9hBmb1UJvFk6R8VgqqXZ',
//     host : 'dpg-d31qhqbuibrs73986jh0-a',
//     port : 5432,
//     database:"chatdb_wnr3"
// });

const pool = new Pool({
    connectionString: "postgresql://chatdb_wnr3_user:Bg5WD2gayHUX9hBmb1UJvFk6R8VgqqXZ@dpg-d31qhqbuibrs73986jh0-a.singapore-postgres.render.com/chatdb_wnr3",
})

export default pool; 