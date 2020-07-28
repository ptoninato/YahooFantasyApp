import pool from './db.js';

async function getYahooGameCodes() {
  try {
    const results = await pool.query('SELECT distinct YahooGameCode FROM gamecode');
    return [...new Set(results.rows.map((item) => item.YahooGameCode))];
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function insertYahooGameCode(gamecodeTypeId, code) {
  const query = 'insert into gamecode(gamecodetypeid, yahoogamecode, season) values ($1, $2, $3)';
  const values = [gamecodeTypeId, code.game_id, code.season];
  pool.query(query, values,
    (err, res) => {
      console.log(err, res);
    });
}

export default { getYahooGameCodes, insertYahooGameCode };
