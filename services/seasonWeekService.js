import pool from './db.js';

const GetSeasonWeeks = async () => {
  const results = await pool.query('select * from seasonweek');
  return results;
};

export default {
  GetSeasonWeeks
};
