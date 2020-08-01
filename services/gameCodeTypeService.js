import pool from './db.js';
import sql from 'sql';

const GameCodeType = sql.define({
  name: 'gamecodetype',
  columns: [
    'gamecodetypeid',
    'yahoogamecode',
    'yahoogamename'
  ]
});

async function getAllCodeTypes() {
  try {
    return await pool.query('SELECT * FROM gamecodetype');
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function getYahooGameCodes() {
  try {
    const results = await pool.query('SELECT distinct yahoogamecode FROM gamecodetype');
    return [...new Set(results.rows.map((item) => item.yahoogamecode))];
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function insertYahooGameCodeType(code) {
  const query = 'insert into gamecodetype(yahoogamecode, yahoogamename) values ($1, $2)';
  const values = [code.code, code.name];

  pool.query(query, values,
    (err, res) => {
      console.log(err, res);
    });
}

async function insertYahooGameCodeTypeMultiple(codes) {
  try {
    const query = GameCodeType.insert(codes).returning(GameCodeType.gamecodetypeid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}


export default { getAllCodeTypes, getYahooGameCodes, insertYahooGameCodeType, insertYahooGameCodeTypeMultiple };
