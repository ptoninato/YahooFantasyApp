import pool from './db.js';
import yahooService from './yahooApiService.js';
import gameCodeTypeModel from '../models/gamecodeTypeModel.js';

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
    const query = gameCodeTypeModel.insert(codes).returning(gameCodeTypeModel.gamecodetypeid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows.length);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

async function importGameCodeType(req, res) {
  const result = await yahooService.getUserGameFromYahoo(req, res);
  const userData = result.data;

  const gamecodes = []; const gameCodeOutput = [];
  for (let i = 0; i < userData.length; i++) {
    if (gamecodes[userData[i].code]) continue;
    gamecodes[userData[i].code] = true;
    gameCodeOutput.push({ code: userData[i].code, name: userData[i].name });
  }

  const existingTypes = await getYahooGameCodes();
  const typesToInsert = [];
  gameCodeOutput.forEach((gamecode) => {
    if (existingTypes.length === 0 || !existingTypes.includes(gamecode.code)) {
      typesToInsert.push({
        yahoogamename: gamecode.name,
        yahoogamecode: gamecode.code
      });
    }
  });
  if (typesToInsert.length > 0) {
    console.log('types importing');
    await insertYahooGameCodeTypeMultiple(typesToInsert);
  }
}

export default {
  getAllCodeTypes,
  getYahooGameCodes,
  insertYahooGameCodeType,
  insertYahooGameCodeTypeMultiple,
  importGameCodeType
};
