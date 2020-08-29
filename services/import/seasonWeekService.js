import pool from '../db.js';

const GetSeasonWeeks = async () => {
  const results = await pool.query('select * from seasonweek');
  return results;
};

const InsertSeasonWeek = async (seasonWeek) => {
  const query = 'INSERT INTO seasonweek(seasonid, weeknumber, startdate, enddate, ispostseason) VALUES($1, $2, $3, $4, $5)';
  const results = await pool.query(query, seasonWeek);
};

export default {
  GetSeasonWeeks,
  InsertSeasonWeek
};
