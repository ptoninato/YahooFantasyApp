import pg from 'pg';

const pool = new pg.Pool();

pool.on('connect', () => {
  console.log('connected to the Database');
});

export default pool;
