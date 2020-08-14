import pool from './db.js';
import leagueModel from '../models/leagueModel.js';
import yahooApiService from './yahooApiService.js';
import gameCodeTypeService from './gameCodeTypeService.js';
import gameCodeService from './gameCodeService.js';

const GetDistinctLeagueNames = async () => {
  try {
    const results = await pool.query('SELECT distinct leaguename FROM leagues');
    return [...new Set(results.rows.map((item) => item.leaguename))];
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetLeagueRecords = async () => {
  try {
    return await pool.query('SELECT * FROM league');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const insertYahooLeagues = async (leagues) => {
  try {
    const query = leagueModel.insert(leagues).returning(leagueModel.leagueid).toQuery();
    const { rows } = await pool.query(query);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
};

async function filterLeagueRecords(leagueRecords) {
  const exisitingGameCodes = await gameCodeTypeService.getAllCodeTypes();
  const existingLeagueNames = await GetDistinctLeagueNames();
  const leagues = []; const leaguesOutput = [];
  for (let i = 0; i < leagueRecords.length; i++) {
    for (let x = 0; x < leagueRecords[i].leagues.length; x++) {
      const currentLeague = leagueRecords[i].leagues[x][0];
      if (leagues[currentLeague.name]
        && (existingLeagueNames.length > 0 || !existingLeagueNames.includes(currentLeague.name))) continue;
      if (currentLeague.name === 'Cerveza Mesa Memorial League' || currentLeague.name === 'The League') {
        const gameCodeType = exisitingGameCodes.rows.filter((value) => value.yahoogamecode === currentLeague.game_code);
        leagues[currentLeague.name] = true;
        leaguesOutput.push({ leaguename: currentLeague.name, gamecodetypeid: gameCodeType[0].gamecodetypeid });
      }
    }
  }
  return leaguesOutput;
}

const InsertLeagues = async (req, res) => {
  const results = await gameCodeService.getYahooGameCodes();
  const gameCodes = await results.map(Number);
  const leagueRecords = await yahooApiService.getUserLeaguesFromYahoo(req, res, gameCodes);
  const leagues = await filterLeagueRecords(leagueRecords.data.games);

  if (leagues.length > 0) {
    console.log(leagues);
    await insertYahooLeagues(leagues);
  }

  return leagues;
};

export default { GetLeagueRecords, InsertLeagues };
