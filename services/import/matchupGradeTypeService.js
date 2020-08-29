import pool from '../db.js';

const GetMatchupGradeTypes = async () => {
  const results = await pool.query('select * from matchupgradetype');
  return results;
};

const InsertMatchupGradeType = async (grade) => {
  const query = 'INSERT INTO matchupgradetype(numericweight, grade) VALUES($1, $2)';
  const results = await pool.query(query, grade);
};

export default {
  GetMatchupGradeTypes,
  InsertMatchupGradeType
};
