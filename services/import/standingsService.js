import pool from '../db.js';
import yahooApiService from './yahooApiService.js';
import viewService from '../viewService.js';
import matchupGradeTypeService from './matchupGradeTypeService.js';

const ImportStandings = async (req, res) => {
  const leagueCodes = await viewService.GetYahooLeagueCodes();
  const teams = await viewService.GetAllYahooTeamKeys();
  const matchupGradeTypes = await matchupGradeTypeService.GetMatchupGradeTypes();

  for (let l = 0; l < leagueCodes.rows.length; l++) {
    const leagueCode = leagueCodes.rows[l];

    if (leagueCode.name === 'Cerveza Mesa Memorial League' && leagueCode.season === '2020') {
      console.log(leagueCode);
      continue;
    }

    let standingsFull;
    try {
      standingsFull = await yahooApiService.GetStandings(req, res, leagueCode.leaguecode);
    } catch (e) {
      continue;
    }
    const { standings } = standingsFull;

    for (let s = 0; s < standings.length; s++) {
      console.log(`${s}/${standings.length}`);
      const standing = standings[s];

      const teamurl = standing.url ?? null;
      const teamlogo = standing.team_logos[0].url ?? null;
      const moves = standing.number_of_moves ?? null;
      const trades = standing.number_of_trades ?? null;
      const rank = standing.standings.rank ?? null;
      const wins = standing.standings.outcome_totals ? standing.standings.outcome_totals.wins : null;
      const loses = standing.standings.outcome_totals ? standing.standings.outcome_totals.losses : null;
      const ties = standing.standings.outcome_totals ? standing.standings.outcome_totals.ties : null;

      const pointsFor = standing.standings.points_for ?? null;
      const pointsAgainst = standing.standings.points_against ?? null;
      const percentage = standing.standings.outcome_totals ? standing.standings.outcome_totals.percentage : null;

      const rosteradds = standing.roster_adds ? standing.roster_adds.value : null;
      const clinchedplayoffs = standing.clinched_playoffs ?? false;
      const playoffseed = standing.standings.playoff_seed ?? null;

      console.log(standing);
      let gamesback = null;
      if (standing.standings.games_back) {
        if (standing.standings.games_back === '-') {
          gamesback = 0;
        } else {
          gamesback = standing.standings.games_back;
        }
      }

      let pointsBack = null;
      if (standing.standings.points_back) {
        pointsBack = standing.standings.games_back;
      }

      let gradeid = null;
      if (standing.draft_grade) {
        const matchupGrade = matchupGradeTypes.rows.filter((value) => value.grade === standing.draft_grade)[0];
        gradeid = matchupGrade.matchupgradetypeid;
      }
      const dbTeam = teams.rows.filter((value) => value.team_key === standing.team_key)[0];

      // console.log(`Updated ${dbTeam.teamname} teamName to ${teamName}`);
      // let query = `update fantasyteam set teamname = '${teamName}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
      // await pool.query(query);

      console.log(`Updated ${dbTeam.teamname} teamurl to ${teamurl}`);
      let query = `update fantasyteam set teamurl = '${teamurl}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
      await pool.query(query);

      console.log(`Updated ${dbTeam.teamname} teamlogo to ${teamlogo}`);
      query = `update fantasyteam set teamlogo = '${teamlogo}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
      await pool.query(query);

      console.log(`Updated ${dbTeam.teamname} moves to ${moves}`);
      query = `update fantasyteam set moves = '${moves}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
      await pool.query(query);

      console.log(`Updated ${dbTeam.teamname} trades to ${trades}`);
      query = `update fantasyteam set trades = '${trades}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
      await pool.query(query);

      if (rank !== null) {
        console.log(`Updated ${dbTeam.teamname} rank to ${rank}`);
        query = `update fantasyteam set rank = '${rank}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
      }

      if (wins !== null) {
        console.log(`Updated ${dbTeam.teamname} wins to ${wins}`);
        query = `update fantasyteam set wins = '${wins}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
      }

      if (loses !== null) {
        console.log(`Updated ${dbTeam.teamname} loses to ${loses}`);
        query = `update fantasyteam set losses = '${loses}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
      }

      if (ties !== null) {
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} ties to ${ties}`);
        query = `update fantasyteam set ties = '${ties}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
      }

      if (percentage !== null) {
        query = `update fantasyteam set percentage = '${percentage}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} percentage to ${percentage}`);
      }

      if (rosteradds !== null) {
        query = `update fantasyteam set rosteradds = '${rosteradds}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} rosteradds to ${rosteradds}`);
      }

      if (clinchedplayoffs !== null) {
        query = `update fantasyteam set clinchedplayoffs = '${clinchedplayoffs}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} clinchedplayoffs to ${clinchedplayoffs}`);
      }

      if (playoffseed !== null) {
        query = `update fantasyteam set playoffseed = '${playoffseed}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} playoffseed to ${playoffseed}`);
      }

      if (gamesback !== null) {
        query = `update fantasyteam set gamesback = '${gamesback}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} gamesback to ${gamesback}`);
      }

      if (gradeid !== null) {
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} gradeid to ${gradeid}`);
        query = `update fantasyteam set gradeid = '${gradeid}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
      }

      if (pointsFor !== null) {
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} pointsFor to ${pointsFor}`);
        query = `update fantasyteam set pointsfor = '${pointsFor}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
      }

      if (pointsAgainst !== null && pointsAgainst !== undefined) {
        query = `update fantasyteam set pointsagainst = '${pointsAgainst}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} pointsAgainst to ${pointsAgainst}`);
      }

      if (pointsBack !== null && pointsBack !== undefined) {
        query = `update fantasyteam set pointsback = '${pointsBack}' where fantasyteamid = ${dbTeam.fantasyteamid}`;
        await pool.query(query);
        console.log(`Updated  ${dbTeam.fantasyteamid}/${dbTeam.teamname} pointsBack to ${pointsBack}`);
      }
    }
  }
  console.log('DONE!');
};

export default {
  ImportStandings
};
