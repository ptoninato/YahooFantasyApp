import pg from 'pg';

const pool = new pg.Pool();

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
  pool.query(
    `INSERT INTO gamecodetype(yahoogamecode, yahoogamename) VALUES ('${code.code}', '${code.name}')`,
    (err, res) => {
      console.log(err, res);
    }
  );
}

export default { getYahooGameCodes, insertYahooGameCodes };
