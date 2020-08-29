import pool from '../db.js';

async function GetExistingSeasonRosterPositions() {
  try {
    const results = await pool.query('SELECT * FROM rosterposition');
    return results.rows;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export default {
  GetExistingSeasonRosterPositions
};
