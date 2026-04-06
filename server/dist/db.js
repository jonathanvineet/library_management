import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:tkt@vav@vj@u1@db.hnpgjwbhndackowriqau.supabase.co:5432/postgres?sslmode=require',
});
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
export default pool;
