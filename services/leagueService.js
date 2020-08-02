import pool from './db.js';
import leagueModel from '../models/leagueModel.js';
import yahooApiService from './yahooApiService.js';
import gameCodeTypeService from './gameCodeTypeService.js';
import gameCodeService from './gameCodeService.js';

const GetLeagueRecords = async () => {
  const query = leagueModel.select(leagueModel.star()).from(leagueModel).toQuery();
  const result = await pool.query(query);
  return result;
};

async function filterLeagueRecords(leagueRecords) {
  const exisitingGameCodes = await gameCodeTypeService.getAllCodeTypes();
  const leagues = []; const leaguesOutput = [];
  for (let i = 0; i < leagueRecords.length; i++) {
    for (let x = 0; x < leagueRecords[i].leagues.length; x++) {
      const currentLeague = leagueRecords[i].leagues[x];
      if (leagues[currentLeague[0].name]) continue;
      // const gameCodeType = exisitingGameCodes.rows.find(({ yahoogamecode }) => yahoogamecode === currentLeague.game_code);
      const gameCodeType = exisitingGameCodes.rows.filter((value) => value.yahoogamecode === currentLeague[0].game_code);
      console.log(currentLeague[0].game_code);
      console.log(gameCodeType);
      leagues[currentLeague[0].name] = true;
      leaguesOutput.push({ leaguename: currentLeague[0].name, gamecodetypeid: gameCodeType[0].gamecodetypeid });
    }
  }
  return leaguesOutput;
}

const InsertLeagues = async (req, res) => {
  const results = await gameCodeService.getYahooGameCodes();
  const gameCodes = await results.map(Number);
  const leagueRecords = await yahooApiService.getUserLeaguesFromYahoo(req, res, gameCodes);
  // const existingLeagueRecords = GetLeagueRecords();

  const leagues = await filterLeagueRecords(leagueRecords.data.games);

  return leagues;
};

export default { GetLeagueRecords, InsertLeagues };
