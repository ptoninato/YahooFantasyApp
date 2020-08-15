import pg from 'pg';
import gameCodeModel from '../models/gamecodeModel.js';
import yahooApiService from './yahooApiService.js';
import gameCodeTypeService from './gameCodeTypeService.js';

const { Pool } = pg;
const pool = new Pool();

const getAllGameCodes = async () => {
  try {
    return await pool.query('SELECT * FROM gamecode');
  } catch (e) {
    console.log(e);
    return e;
  }
};

async function getYahooGameCodes() {
  try {
    const results = await pool.query('SELECT distinct yahoogamecode FROM gamecode');
    return [...new Set(results.rows.map((item) => item.yahoogamecode))];
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function insertYahooGameCodeMultiple(codes) {
  try {
    const query = gameCodeModel.insert(codes).returning(gameCodeModel.gamecodeid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows.length);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

async function importGameCode(req, res) {
  const result = await yahooApiService.getUserGameFromYahoo(req, res);
  const userData = result.data;

  const gameCodes = await getYahooGameCodes();
  const allGameCodeTypes = await gameCodeTypeService.getAllCodeTypes();
  let nflTypeId;
  let mlbTypeId;

  for (let i = 0; i < allGameCodeTypes.rows.length; i++) {
    if (allGameCodeTypes.rows[i].yahoogamecode === 'nfl') {
      nflTypeId = allGameCodeTypes.rows[i].gamecodetypeid;
    } else if (allGameCodeTypes.rows[i].yahoogamecode === 'mlb') {
      mlbTypeId = allGameCodeTypes.rows[i].gamecodetypeid;
    }
  }

  const codesToImport = [];
  userData.forEach((code) => {
    if (gameCodes.length === 0 || !gameCodes.includes(code.game_id)) {
      if (code.code === 'nfl') {
        codesToImport.push(
          {
            gamecodetypeid: nflTypeId,
            yahoogamecode: code.game_id,
            season: code.season
          }
        );
      } else if (code.code === 'mlb') {
        codesToImport.push(
          {
            gamecodetypeid: mlbTypeId,
            yahoogamecode: code.game_id,
            season: code.season
          }
        );
      }
    }
  });

  if (codesToImport.length > 0) {
    await insertYahooGameCodeMultiple(codesToImport);
  }
}

async function insertYahooGameCode(gamecodeTypeId, code) {
  const query = 'insert into gamecode(gamecodetypeid, yahoogamecode, season) values ($1, $2, $3)';
  const values = [gamecodeTypeId, code.game_id, code.season];
  (async () => {
    try {
      await pool.query(query, values);
    } catch (err) {
      console.error(err);
    }
  })();
}

export default {
  getAllGameCodes,
  getYahooGameCodes,
  insertYahooGameCode,
  insertYahooGameCodeMultiple,
  importGameCode
};
