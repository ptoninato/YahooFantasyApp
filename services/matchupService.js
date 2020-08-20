import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import viewService from './viewService.js';
import seasonService from './seasonService.js';
import gameCodeService from './gameCodeService.js';
import seasonWeekService from './seasonWeekService.js';

const GetMatchups = async () => {
  const results = await pool.query('select * from matchup');
  return results;
};

const ImportMatchupTeam = async (req, res) => {
  const seasons = await seasonService.getExistingSeasons();
  const gameCodes = await gameCodeService.getAllGameCodes();
  const seasonWeeks = await seasonWeekService.GetSeasonWeeks();
  const matchups = await GetMatchups();
  console.log(seasons.length);
  for (let s = 0; s < 1; s++) {
    const season = seasons[s];
    const lastWeek = season.lastweek;
    const gameCodeFilter = await gameCodes.rows.filter((value) => value.gamecodeid === season.gamecodeid);
    const gameCode = gameCodeFilter[0];

    for (let w = 1; w <= 1; w++) {
      try {
        const data = await yahooApiService.getLeagueScoreboardByWeek(req, res, `${gameCode.yahoogamecode}.l.${season.yahooleagueid}`, w);
      } catch {
        continue;
      }
      console.log(`${w}/${lastWeek}`);

      const seasonWeekFilter = seasonWeeks.rows.filter((value) => value.seasonid === season.seasonid && value.week && value.weeknumber === w);

      if (seasonWeekFilter.length === 0) {
        const seasonWeek = [
          season.seasonid,
          w,
          data.scoreboard.matchups[0].week_start,
          data.scoreboard.matchups[0].week_end
        ];
      }

      const matchup = matchups.rows.filter((value) => value.seasonid === season.seasonid && value.week === w);

      if (matchup.length === 0) {
        const matchup = {};
      }
    }
    console.log('-----------------');
  }
};

export default {
  ImportMatchupTeam
};
