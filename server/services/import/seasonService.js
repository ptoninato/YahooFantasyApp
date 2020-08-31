import pool from '../db.js';
import seasonModel from '../../models/import/seasonModel.js';
import yahooApiService from './yahooApiService.js';
import leagueService from './leagueService.js';
import gameCodeService from './gameCodeService.js';

async function getExistingSeasons() {
  try {
    const results = await pool.query('SELECT * FROM season order by leagueid desc, startdate desc');
    return results.rows;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function getSeasonIdYahooLeagueIdAndGameCodeId() {
  try {
    const query = `select s.seasonid, s.yahooleagueid, gc.yahoogamecode from season as s
    join gamecode as gc on s.gamecodeid = gc.gamecodeid
    order by seasonid desc`;
    const results = await pool.query(query);
    return results.rows;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function insertSeasons(seasons) {
  try {
    const query = seasonModel.insert(seasons).returning(seasonModel.seasonid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows.length);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

async function filterSeasonRecords(leagueRecords) {
  const existingLeagues = await leagueService.GetLeagueRecords();
  const existingSeasons = await getExistingSeasons();
  const existingGameCodes = await gameCodeService.getAllGameCodes();
  const seasonsOutput = [];
  for (let i = 0; i < leagueRecords.length; i++) {
    for (let x = 0; x < leagueRecords[i].leagues.length; x++) {
      const currentGameCode = leagueRecords[i].game_id;
      const gamecode = await existingGameCodes.rows.filter((value) => value.yahoogamecode === currentGameCode);
      const currentLeagues = await leagueRecords[i].leagues[x].filter((value) => value.name === 'The League' || value.name === 'Cervesa Mesa Memorial League');
      if (currentLeagues.length === 0) continue;
      const currentLeague = currentLeagues[0];
      const league = await existingLeagues.rows.filter((value) => value.leaguename === currentLeague.name);
      const existingSeason = await existingSeasons.filter((value) => value.gamecodeid === gamecode[0].gamecodeid && value.leagueid === league[0].leagueid && value.yahooleagueid === Number(currentLeague.league_id));
      if (existingSeason.length > 0) continue;
      if (currentLeague.name === 'Cerveza Mesa Memorial League' || currentLeague.name === 'The League') {
        seasonsOutput.push(
          {
            leagueid: league[0].leagueid,
            yahooleagueid: currentLeague.league_id,
            gamecodeid: gamecode[0].gamecodeid,
            startdate: currentLeague.start_date,
            enddate: currentLeague.end_date,
            seasonyear: currentLeague.season,
            scoringtype: currentLeague.scoring_type,
            firstweek: currentLeague.start_week,
            lastweek: currentLeague.end_week
          }
        );
      }
    }
  }
  return seasonsOutput;
}

const importSeasons = async (req, res) => {
  const results = await gameCodeService.getYahooGameCodes();
  const gameCodes = await results.map(Number);
  const leagueRecords = await yahooApiService.getUserLeaguesFromYahoo(req, res, gameCodes);
  const seasons = await filterSeasonRecords(leagueRecords.data.games);
  if (seasons.length > 0) {
    await insertSeasons(seasons);
  }

  return seasons;
};

export default {
  importSeasons,
  getSeasonIdYahooLeagueIdAndGameCodeId,
  getExistingSeasons
};
