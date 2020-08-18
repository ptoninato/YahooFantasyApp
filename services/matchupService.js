import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import viewService from './viewService.js';
import seasonService from './seasonService.js';
import gamecodeService from './gameCodeService.js';

const importMatchups = async (req, res) => {
  const leagueCodes = await viewService.GetYahooLeagueCodes();
  const seasons = await seasonService.getExistingSeasons();
  const gamecodes = await gamecodeService.getAllGameCodes();
  for (let l = 0; l < 1; l++) {
    const leagueCode = await leagueCodes.rows[l];
    const splitLeagueCode = leagueCode.leaguecode.split('.');
    const yahoogamecode = splitLeagueCode[0];
    const yahooleagueid = splitLeagueCode[2];
    const gamecodeFilter = gamecodes.rows.filter((value) => value.yahoogamecode === yahoogamecode);
    const gamecode = gamecodeFilter[0];
    const seasonFilter = await seasons.filter((value) => value.gamecodeid === Number(gamecode.gamecodeid) && value.yahooleagueid === Number(yahooleagueid));
    const season = seasonFilter[0];

    const leagueSettings = await yahooApiService.getLeagueSettings(req, res, leagueCode.leaguecode);

    if (leagueSettings.data.settings.trade_end_date) {
      // const date = new Date(leagueSettings.data.settings.trade_end_date);
      const date = new Date(leagueSettings.data.settings.trade_end_date).valueOf();
      const query = `update season set tradeenddate = '${leagueSettings.data.settings.trade_end_date}' where seasonid = ${season.seasonid};`;
      const tradeUpdateResults = await pool.query(query);
    }

    if (leagueSettings.data.settings.playoffstartdate) {
      const playoffstartweek = await pool.query(`update season set playoffstartdate = ${leagueSettings.data.settings.playoffstartdate} where seasonid = ${season.seasonid}`);
      console.log('dont run');
    }

    const rosterpositions = 

  }
};

export default {
  importMatchups
};
