import pool from './db.js';
import seasonModel from '../models/seasonModel.js';
import yahooApiService from './yahooApiService.js';
import leagueService from './leagueService.js';
import gameCodeService from './gameCodeService.js';

async function insertSeasons(seasons) {
  try {
    const query = seasonModel.insert(seasons).returning(seasonModel.seasonid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

async function filterSeasonRecords(leagueRecords) {
  const existingLeagues = await leagueService.GetLeagueRecords();
  const seasonsOutput = [];
  for (let i = 0; i < leagueRecords.length; i++) {
    for (let x = 0; x < leagueRecords[i].leagues.length; x++) {
      const currentLeague = leagueRecords[i].leagues[x][0];
      if (existingLeagues.length > 0) continue;
      const league = existingLeagues.rows.filter((value) => value.leaguename === currentLeague.name);
      seasonsOutput.push(
        {
          leagueid: league[0].leagueid,
          yahooleagueid: currentLeague.league_id,
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
  return seasonsOutput;
}

const importSeasons = async (req, res) => {
  const results = await gameCodeService.getYahooGameCodes();
  const gameCodes = await results.map(Number);
  const leagueRecords = await yahooApiService.getUserLeaguesFromYahoo(req, res, gameCodes);
  const sesaons = await filterSeasonRecords(leagueRecords.data.games);

  if (sesaons.length > 0) {
    await insertSeasons(sesaons);
  }

  return sesaons;
};

export default {
  importSeasons
};
