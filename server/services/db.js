import pg from 'pg';

const pool = new pg.Pool();

pool.on('connect', () => { });

export default pool;
