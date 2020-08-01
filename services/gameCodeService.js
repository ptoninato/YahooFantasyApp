import pg from 'pg';
import sql from 'sql';

const { Pool } = pg;
const pool = new Pool();

const GameCode = sql.define({
  name: 'gamecode',
  columns: [
    'gamecodeid',
    'gamecodetypeid',
    'yahoogamecode',
    'season'
  ]
});

async function getYahooGameCodes() {
  try {
    const results = await pool.query('SELECT distinct yahoogamecode FROM gamecode');
    return [...new Set(results.rows.map((item) => item.yahoogamecode))];
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function insertYahooGameCode(gamecodeTypeId, code) {
  const query = 'insert into gamecode(gamecodetypeid, yahoogamecode, season) values ($1, $2, $3)';
  const values = [gamecodeTypeId, code.game_id, code.season];
  console.log(values);
  (async () => {
    try {
      await pool.query(query, values);
    } catch (err) {
      console.error(err);
    }
  })();
}

async function insertYahooGameCodeMultiple(codes) {
  try {
    const query = GameCode.insert(codes).returning(GameCode.gamecodeid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

export default { getYahooGameCodes, insertYahooGameCode, insertYahooGameCodeMultiple };
