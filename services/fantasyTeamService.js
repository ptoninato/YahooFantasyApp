import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import ownerService from './ownerService.js';
import leagueService from './leagueService.js';
import fantasyTeamModel from '../models/fantasyteamModel.js';

const seasonsToImport = async (req, res) => {
  try {
    return await pool.query('select gc.yahoogamecode as gamecode, s.yahooleagueid as league, s.seasonid as seasonid from season as s join gamecode as gc on s.gamecodeid = gc.gamecodeid');
  } catch (e) {
    console.log(e);
    return e;
  }
};

async function insertFantasyTeams(fantasyTeams) {
  try {
    const query = fantasyTeamModel.insert(fantasyTeams).returning(fantasyTeamModel.fantasyteamid).toQuery();
    const { rows } = await pool.query(query);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

const importFantasyTeams = async (req, res) => {
  const results = await seasonsToImport(req, res);
  const existingLeagues = await leagueService.GetLeagueRecords();
  let existingOwners = await ownerService.getOwnersFromDb();
  let uniqueExistingGuids = await ownerService.getYahooGuidsFromDb();
  const seasonCodes = results.rows;

  const fantasyTeamsToImport = [];
  for (let i = 0; i < seasonCodes.length; i++) {
    const currentSeason = seasonCodes[i];
    const yahooLeague = `${currentSeason.gamecode}.l.${currentSeason.league}`
    const apiData = await yahooApiService.getLeagueTeams(req, res, yahooLeague);
    const season = apiData.data;
    const league = existingLeagues.rows.filter((value) => value.leaguename === season.name);
    for (let x = 0; x < season.teams.length; x++) {
      const currentTeam = season.teams[x];
      const owners = currentTeam.managers;
      const uniqueGuids = [...new Set(owners.map((item) => item.guid))];
      if (existingOwners.length === 0 || !uniqueExistingGuids.includes(uniqueGuids)) {
        await ownerService.importOwners(req, res, currentTeam.managers, league[0].leagueid);
        existingOwners = await ownerService.getOwnersFromDb();
        uniqueExistingGuids = await ownerService.getYahooGuidsFromDb();
      }

      for (let y = 0; y < 1; y++) {
        const owner = owners[y];
        const ownerFromDb = existingOwners.rows.filter((value) => value.yahooguid === owner.guid);
        const fantasyTeam = {
          leagueid: league[0].leagueid,
          seasonid: currentSeason.seasonid,
          ownerid: ownerFromDb[0].ownerid,
          yahooteamid: currentTeam.team_id,
          teamname: currentTeam.name
        };

        fantasyTeamsToImport.push(fantasyTeam);
      }
    }
  }

  await insertFantasyTeams(fantasyTeamsToImport);

  return fantasyTeamsToImport;
};

export default { seasonsToImport, importFantasyTeams };
