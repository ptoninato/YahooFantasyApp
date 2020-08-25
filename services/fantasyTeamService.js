import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import ownerService from './ownerService.js';
import leagueService from './leagueService.js';
import fantasyTeamModel from '../models/fantasyteamModel.js';

const seasonsToImport = async () => {
  try {
    return await pool.query('select gc.yahoogamecode as gamecode, s.yahooleagueid as league, s.seasonid as seasonid from season as s join gamecode as gc on s.gamecodeid = gc.gamecodeid');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetExistingTeams = async () => {
  try {
    return await pool.query('select * from fantasyteam');
  } catch (e) {
    console.log(e);
    return e;
  }
};

async function insertFantasyTeams(fantasyTeams) {
  try {
    const query = fantasyTeamModel.insert(fantasyTeams).returning(fantasyTeamModel.fantasyteamid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows.length);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

const importFantasyTeams = async (req, res) => {
  const results = await seasonsToImport(req, res);
  const existingLeagues = await leagueService.GetLeagueRecords();
  const existingTeams = await GetExistingTeams();
  let existingOwners = await ownerService.getOwnersFromDb();
  let uniqueExistingGuids = await ownerService.getYahooGuidsFromDb();
  const seasonCodes = results.rows;

  const fantasyTeamsToImport = [];
  for (let i = 0; i < seasonCodes.length; i++) {
    const currentSeason = seasonCodes[i];
    const yahooLeague = `${currentSeason.gamecode}.l.${currentSeason.league}`;
    let apiData;
    try {
      apiData = await yahooApiService.getLeagueTeams(req, res, yahooLeague);
    } catch (e) {
      console.log(e);
      continue;
    }
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
        const existingSeason = existingTeams.rows.filter((value) => value.leagueid === league[0].leagueid && value.seasonid === currentSeason.seasonid && (value.ownerid === ownerFromDb[0].ownerid || value.teamname === currentTeam.name));
        if (existingSeason.length > 0) continue;
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

  if (fantasyTeamsToImport.length > 0) {
    await insertFantasyTeams(fantasyTeamsToImport);
  }

  return fantasyTeamsToImport;
};

export default { seasonsToImport, importFantasyTeams };
