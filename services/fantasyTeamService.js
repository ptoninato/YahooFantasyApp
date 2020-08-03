import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import ownerService from './ownerService.js';
import leagueService from './leagueService.js'

const seasonsToImport = async (req, res) => {
  try {
    return await pool.query('select CONCAT(gc.yahoogamecode,\'.l.\',s.yahooleagueid) as league from season as s join gamecode as gc on s.gamecodeid = gc.gamecodeid');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const importFantasyTeams = async (req, res) => {
  const results = await seasonsToImport(req, res);
  const existingLeagues = await leagueService.GetLeagueRecords();
  const seasonCodes = results.rows;
  for (let i = 0; i < seasonCodes.length; i++) {
    const currentSeason = seasonCodes[i];
    const apiData = await yahooApiService.getLeagueTeams(req, res, currentSeason.league);
    const season = apiData.data;
    const league = existingLeagues.rows.filter((value) => value.leaguename === season.name);
    for (let x = 0; x < season.teams.length; x++) {
      const currentTeam = season.teams[x];
      ownerService.importOwners(req, res, currentTeam.managers, league[0].leagueid);
    }
  }
  return 'test';
};

export default { seasonsToImport, importFantasyTeams };
