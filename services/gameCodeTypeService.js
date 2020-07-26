import pool from './db.js';

async function getYahooGameCodes() {
  try {
    const results = await pool.query('SELECT distinct yahoogamecode FROM gamecodetype');
    return [...new Set(results.rows.map((item) => item.yahoogamecode))];
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function insertYahooGameCodes(code) {
  const query = 'insert into gamecodetype(yahoogamecode, yahoogamename) values ($1, $2)';
  const values = [code.code, code.name];

  pool.query(query, values,
    (err, res) => {
      console.log(err, res);
    });
}

export default { getYahooGameCodes, insertYahooGameCodes };
