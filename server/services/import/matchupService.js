import pool from '../db.js';
import yahooApiService from './yahooApiService.js';
import viewService from '../viewService.js';
import seasonService from './seasonService.js';
import gameCodeService from './gameCodeService.js';
import seasonWeekService from './seasonWeekService.js';

const GetMatchups = async () => {
  const results = await pool.query('select * from matchup');
  return results;
};

const ImportMatchupTeam = async (req, res, currentSeasonOnly) => {
  let seasons;

  if (currentSeasonOnly) {
    seasons = await seasonService.getCurrentSeasons();
  } else {
    seasons = await seasonService.getExistingSeasons();
  }
  console.log('here');

  const gameCodes = await gameCodeService.getAllGameCodes();
  let seasonWeeks = await seasonWeekService.GetSeasonWeeks();
  const teams = await viewService.GetAllYahooTeamKeys();
  const matchups = await GetMatchups();
  for (let s = 0; s < seasons.length; s++) {
    const season = seasons[s];
    const lastWeek = season.lastweek;
    const gameCodeFilter = await gameCodes.rows.filter((value) => value.gamecodeid === season.gamecodeid);
    const gameCode = gameCodeFilter[0];

    if (new Date(season.startdate) > Date.now()) {
      continue;
    }

    for (let w = 1; w <= lastWeek; w++) {
      let data;
      const fullLeagueCode = `${gameCode.yahoogamecode}.l.${season.yahooleagueid}`;
      try {
        data = await yahooApiService.getLeagueScoreboardByWeek(req, res, fullLeagueCode, w);
      } catch {
        continue;
      }
      console.log(`${w}/${lastWeek}`);

      if (new Date(data.scoreboard.matchups[0].week_end) >= Date.now()) {
        continue;
      }

      let seasonWeek = seasonWeeks.rows.filter((value) => value.seasonid === season.seasonid && value.weeknumber === w)[0];

      if (!seasonWeek) {
        const seasonWeekInsert = [
          season.seasonid,
          w,
          data.scoreboard.matchups[0].week_start,
          data.scoreboard.matchups[0].week_end,
          data.scoreboard.matchups[0].is_playoffs
        ];
        console.log(`Adding Week ${w} of ${lastWeek} to Season ${season.seasonyear} for ${fullLeagueCode}`);
        await seasonWeekService.InsertSeasonWeek(seasonWeekInsert);
        seasonWeeks = await seasonWeekService.GetSeasonWeeks();
        seasonWeek = seasonWeeks.rows.filter((value) => value.seasonid === season.seasonid && value.weeknumber === w)[0];
      }

      for (let m = 0; m < data.scoreboard.matchups.length; m++) {
        const yahooMatchup = data.scoreboard.matchups[m];
        const isTied = yahooMatchup.is_tied;

        let team1;
        let team2;
        let dbTeam1;
        let dbTeam2;

        if (isTied) {
          console.log('isTied');
          const firstTeam = yahooMatchup.teams[0];
          const secondTeam = yahooMatchup.teams[1];
          team1 = yahooMatchup.teams.filter((value) => value.team_key === firstTeam.team_key)[0];
          team2 = yahooMatchup.teams.filter((value) => value.team_key === secondTeam.team_key)[0];
        } else {
          const team1Key = yahooMatchup.winner_team_key;
          team1 = yahooMatchup.teams.filter((value) => value.team_key === team1Key)[0];
          team2 = yahooMatchup.teams.filter((value) => value.team_key !== team1Key)[0];
        }

        dbTeam1 = teams.rows.filter((value) => value.team_key === team1.team_key)[0];
        dbTeam2 = teams.rows.filter((value) => value.team_key === team2.team_key)[0];
        const winningTeam = isTied ? null : dbTeam1.fantasyteamid;
        const losingTeam = isTied ? null : dbTeam2.fantasyteamid;

        if (team1.team_key !== dbTeam1.team_key) {
          console.log(`${team1.team_key}/${dbTeam1.team_key}`);
        }

        if (team2.team_key !== dbTeam2.team_key) {
          console.log(`${team2.team_key}/${dbTeam2.team_key}`);
        }
        let matchup = matchups.rows.filter((value) => value.seasonid === season.seasonid && value.seasonweekid === seasonWeek.seasonweekid && value.fantasyteamid1 === dbTeam1.fantasyteamid && value.fantasyteamid2 === dbTeam2.fantasyteamid);

        if (matchup.length === 0) {
          matchup = [
            dbTeam1.fantasyteamid,
            dbTeam2.fantasyteamid,
            winningTeam,
            yahooMatchup.is_playoffs,
            yahooMatchup.is_consolation,
            season.seasonid,
            yahooMatchup.matchup_recap_title,
            yahooMatchup.matchup_recap_url,
            seasonWeek.seasonweekid,
            losingTeam,
            isTied
          ];
          console.log(`Adding matchup for week ${w} matchup between ${dbTeam1.teamname} and ${dbTeam2.teamname}`);
          const query = 'INSERT INTO matchup(fantasyteamid1, fantasyteamid2, winningteamid, isplayoffs, isconsolation, seasonid, matchuprecap, matchuprecaptitle, seasonweekid, losingteamid, tie) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
          const results = await pool.query(query, matchup);
        }
      }
    }
    console.log('-----------------');
  }
};

export default {
  ImportMatchupTeam,
  GetMatchups
};
