import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import viewService from './viewService.js';
import seasonService from './seasonService.js';
import gameCodeService from './gameCodeService.js';
import seasonWeekService from './seasonWeekService.js';
import matchupGradeTypeService from './matchupGradeTypeService.js';
import matchupService from './matchupService.js';

const GetMatchupTeams = async () => {
  const results = await pool.query('select * from matchupteam');
  return results;
};

const InsertMatchupGradeType = async (grade) => {
  const query = 'INSERT INTO seasonweek(numericweight, grade) VALUES($1, $2)';
  const results = await pool.query(query, grade);
};

const ImportMatchupTeam = async (req, res) => {
  const teams = await viewService.GetAllYahooTeamKeys();
  const matchups = await matchupService.GetMatchups();
  let matchupGradeTypes = await matchupGradeTypeService.GetMatchupGradeTypes();
  const matchupTeams = await GetMatchupTeams();
  const seasons = await seasonService.getExistingSeasons();
  const gameCodes = await gameCodeService.getAllGameCodes();
  const seasonWeeks = await seasonWeekService.GetSeasonWeeks();

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
      } catch (e) {
        console.log(e);
        continue;
      }
      console.log(`${fullLeagueCode}: ${w}/${lastWeek}`);

      if (new Date(data.scoreboard.matchups[0].week_end) >= Date.now()) {
        continue;
      }

      const seasonWeek = seasonWeeks.rows.filter((value) => value.seasonid === season.seasonid && value.weeknumber === w)[0];
      const matchupForWeek = matchups.rows.filter((value) => value.seasonweekid === seasonWeek.seasonweekid);
      for (let m = 0; m < data.scoreboard.matchups.length; m++) {
        const yahooMatchup = data.scoreboard.matchups[m];
        const isTied = yahooMatchup.is_tied;
        console.log('-----------');
        if (yahooMatchup.matchup_grades) {
          for (let g = 0; g < yahooMatchup.matchup_grades.length; g++) {
            const grade = yahooMatchup.matchup_grades[g];
            const existingGrade = matchupGradeTypes.rows.filter((value) => value.grade === grade.grade);
            if (existingGrade.length === 0) {
              const gradeInsert = [
                undefined,
                grade.grade
              ];
              console.log(`Inserting Grade ${grade.grade}`);
              await matchupGradeTypeService.InsertMatchupGradeType(gradeInsert);
              matchupGradeTypes = await matchupGradeTypeService.GetMatchupGradeTypes();
            }
          }
        }

        let skipTiedScore = false;
        for (let t = 0; t < yahooMatchup.teams.length; t++) {
          const matchupTeam = yahooMatchup.teams[t];
          const dbTeam = teams.rows.filter((value) => value.team_key === matchupTeam.team_key)[0];
          const matchup = matchupForWeek.filter((value) => value.fantasyteamid1 === dbTeam.fantasyteamid || value.fantasyteamid2 === dbTeam.fantasyteamid)[0];
          const existingMatchupTeam = matchupTeams.rows.filter((value) => value.matchupid === matchup.matchupid && value.fantasyteamid === dbTeam.fantasyteamid);
          if (existingMatchupTeam.length === 0) {
            let matchupgradeid;
            if (yahooMatchup.matchup_grades) {
              const yahooMatchupGrade = yahooMatchup.matchup_grades.filter((value) => value.team_key === matchupTeam.team_key)[0];
              const matchupGrade = matchupGradeTypes.rows.filter((value) => value.grade === yahooMatchupGrade.grade)[0];
              matchupgradeid = matchupGrade.matchupgradetypeid;
            }

            const pointsFor = matchupTeam.points.total;
            let projectedPointsFor;
            if (matchupTeam.projected_points) {
              projectedPointsFor = matchupTeam.projected_points.total;
            }

            const newMatchup = [
              matchup.matchupid,
              dbTeam.fantasyteamid,
              pointsFor,
              projectedPointsFor,
              matchupgradeid
            ];

            console.log(`Adding matchup for ${dbTeam.teamname} for matchup ${matchup.matchupid}`);
            const query = 'INSERT INTO matchupteam(matchupid, fantasyteamid, pointsfor, projectedpointsfor, matchupgradetypeid) VALUES($1, $2, $3, $4, $5)';
            const results = await pool.query(query, newMatchup);

            if (yahooMatchup.stat_winners && !skipTiedScore) {
              const tiedScores = yahooMatchup.stat_winners.filter((value) => value.stat_winner.is_tied === 1);
              if (tiedScores.length > 0) {
                const newTiedMatchup = [
                  matchup.matchupid,
                  tiedScores.length
                ];
                console.log(`Adding Tied Score for matchup ${matchup.matchupid}`);
                const query = 'INSERT INTO matchupteam(matchupid, tiedpoints) VALUES($1, $2)';
                const results = await pool.query(query, newTiedMatchup);
                skipTiedScore = true;
              }
            }
          }
        }
      }
    }
  }
};

export default {
  GetMatchupTeams,
  InsertMatchupGradeType,
  ImportMatchupTeam
};
