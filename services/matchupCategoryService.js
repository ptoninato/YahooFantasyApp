import moment from 'moment';
import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import viewService from './viewService.js';
import seasonService from './seasonService.js';
import gameCodeService from './gameCodeService.js';
import seasonWeekService from './seasonWeekService.js';
import matchupGradeTypeService from './matchupGradeTypeService.js';
import matchupService from './matchupService.js';
import matchupTeamService from './matchupTeamService.js';
import statCategoryService from './statCategoryService.js';

let teams;
let matchups;
let matchupGradeTypes;
let matchupTeams;
let seasons;
let gameCodes;
let seasonWeeks;
let matchupCategoryTeams;
let matchupCategoryResults;
let statCategories;

const GetMatchupCategoryTeams = async (req, res) => {
  const results = await pool.query('select * from matchupcategoryteam');
  return results;
};

const GetMatchupCategoryResults = async (req, res) => {
  const results = await pool.query('select * from matchupcategoryresult');
  return results;
};

const ImportCategoryWeeks = async (req, res, lastWeek, gameCode, season) => {
  for (let w = 1; w <= lastWeek; w++) {
    let data;
    const fullLeagueCode = `${gameCode.yahoogamecode}.l.${season.yahooleagueid}`;
    try {
      data = await yahooApiService.getLeagueScoreboardByWeek(req, res, fullLeagueCode, w);
    } catch (e) {
      console.log(e);
      return;
    }

    console.log(`${fullLeagueCode}: ${w}/${lastWeek}, ${new Date(data.scoreboard.matchups[0].week_end)}`);

    if ((moment(data.scoreboard.matchups[0].week_end).startOf('day') >= moment(new Date()).startOf('day'))) {
      console.log('skip');
      continue;
    }
    const seasonWeek = seasonWeeks.rows.filter((value) => value.seasonid === season.seasonid && value.weeknumber === w)[0];
    const matchupsInWeek = matchups.rows.filter((value) => value.seasonweekid === seasonWeek.seasonweekid);

    for (let m = 0; m < data.scoreboard.matchups.length; m++) {
      const yahooMatchup = data.scoreboard.matchups[m];
      const firstTeam = yahooMatchup.teams[0];
      const secondTeam = yahooMatchup.teams[1];

      const dbTeam1 = teams.rows.filter((value) => value.team_key === firstTeam.team_key)[0];
      const dbTeam2 = teams.rows.filter((value) => value.team_key === secondTeam.team_key)[0];

      const matchupsForTeams = matchupsInWeek.filter((value) => (value.fantasyteamid1 === dbTeam1.fantasyteamid || value.fantasyteamid2 === dbTeam1.fantasyteamid));

      const matchupTeamsForWeek = matchupTeams.rows.filter((value) => (value.matchupid === matchupsForTeams[0].matchupid));

      if (yahooMatchup.stat_winners) {
        for (let x = 0; x < yahooMatchup.stat_winners.length; x++) {
          const statWinner = yahooMatchup.stat_winners[x];
          const statCategory = statCategories.rows.filter((value) => value.seasonid === season.seasonid && value.yahoocategoryid === Number(statWinner.stat_winner.stat_id));

          const existingMatchupResult = matchupCategoryResults.rows.filter((value) => value.matchupid === matchupsForTeams[0].matchupid && value.seasonstatcategoryid === statCategory[0].seasonstatcategoryid);

          // if (statWinner.stat_winner.is_tied) {
          //   console.log(matchupsForTeams[0].matchupid);
          //   console.log(statWinner);
          //   console.log(existingMatchupResult);
          // }

          if (existingMatchupResult.length === 0) {
            console.log(statWinner);
            if (statWinner.stat_winner.is_tied) {
              console.log(statWinner);
              const matchupCategoryResult = [
                matchupsForTeams[0].matchupid,
                statCategory[0].seasonstatcategoryid,
                true
              ];

              console.log(`Adding TIED matchup category result for ${matchupsForTeams[0].matchupid} && ${statCategory[0].seasonstatcategoryid}`);
              const query = 'INSERT INTO matchupcategoryresult(matchupid, seasonstatcategoryid, isTied) VALUES($1, $2, $3)';
              const results = await pool.query(query, matchupCategoryResult);
              console.log('------------------');
            } else {
              if (!statWinner.stat_winner.winner_team_key) {
                console.log('fail');
                continue;
              }
              const winningTeam = statWinner.stat_winner.winner_team_key === dbTeam1.team_key ? dbTeam1 : dbTeam2;
              const losingTeam = winningTeam.team_key === dbTeam1.team_key ? dbTeam2 : dbTeam1;
              const matchupCategoryResult = [
                matchupsForTeams[0].matchupid,
                statCategory[0].seasonstatcategoryid,
                winningTeam.fantasyteamid,
                losingTeam.fantasyteamid
              ];
              console.log(matchupCategoryResult);
              console.log(`Adding matchup category result for week ${w} matchup between ${dbTeam1.teamname} and ${dbTeam2.teamname}`);
              const query = 'INSERT INTO matchupcategoryresult(matchupid, seasonstatcategoryid, winningteamid, losingteamid) VALUES($1, $2, $3, $4)';
              const results = await pool.query(query, matchupCategoryResult);
              console.log('------------------');
            }
          }
        }
      }
      for (let t = 0; t < yahooMatchup.teams.length; t++) { }
    }
  }
};

const ImportMatchupCategories = async (req, res) => {
  teams = await viewService.GetAllYahooTeamKeys();
  matchups = await matchupService.GetMatchups();
  matchupTeams = await matchupTeamService.GetMatchupTeams();
  seasons = await seasonService.getExistingSeasons();
  gameCodes = await gameCodeService.getAllGameCodes();
  seasonWeeks = await seasonWeekService.GetSeasonWeeks();
  matchupCategoryTeams = await GetMatchupCategoryTeams();
  matchupCategoryResults = await GetMatchupCategoryResults();
  statCategories = await statCategoryService.GetStatCategorySeasonIdYahooCategoryId();
  for (let s = 0; s < seasons.length; s++) {
    const season = seasons[s];
    const lastWeek = season.lastweek;
    const gameCodeFilter = await gameCodes.rows.filter((value) => value.gamecodeid === season.gamecodeid);
    const gameCode = gameCodeFilter[0];

    if (new Date(season.startdate) > Date.now()) {
      continue;
    }

    await ImportCategoryWeeks(req, res, lastWeek, gameCode, season);
  }
};

export default {
  ImportMatchupCategories
};
