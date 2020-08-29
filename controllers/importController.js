import pool from '../services/db.js';
import gameCodeTypeService from '../services/import/gameCodeTypeService.js';
import gameCodeService from '../services/import/gameCodeService.js';
import leagueService from '../services/import/leagueService.js';
import sesaonService from '../services/import/seasonService.js';
import fantasyTeamService from '../services/import/fantasyTeamService.js';
import transactionService from '../services/import/transactionService.js';
import seasonPositionService from '../services/import/seasonPositionService.js';
import statCategoryService from '../services/import/statCategoryService.js';
import matchupService from '../services/import/matchupService.js';
import seasonStatModifier from '../services/import/seasonStatModifierService.js';
import matchupTeamService from '../services/import/matchupTeamService.js';
import matchupCategoryService from '../services/import/matchupCategoryService.js';
import matchupRosterService from '../services/import/matchupRosterService.js';
import matchupRosterPlayStatService from '../services/import/matchupRosterPlayerStat.js';
import draftService from '../services/import/draftService.js';
import standingsService from '../services/import/standingsService.js';

function ImportController() {
  async function importBothGameTypeAndGame(req, res) {
    console.log('start type');
    let data = await gameCodeTypeService.importGameCodeType(req, res);
    console.log('start gamecode');
    data = await gameCodeService.importGameCode(req, res);
    res.render('secret.ejs', { data });
  }

  async function importAll(req, res) {
    try {
      let query = 'select * from importlock';
      const results = await pool.query(query);
      let data;
      if (results.rows[0].locked === true) {
        data = 'Error: Import Already Running. Stop Refreshing the Page Nick!!!';
        return res.redirect(500, 'secret.ejs', { data });
      }

      console.log('Locking Import....');
      query = 'update importlock set locked = true';
      await pool.query(query);

      console.log('start type');
      data = await gameCodeTypeService.importGameCodeType(req, res);
      console.log('end type');

      console.log('start gamecode');
      data = await gameCodeService.importGameCode(req, res);
      console.log('end gamecode');

      console.log('start leagues');
      data = await leagueService.InsertLeagues(req, res);
      console.log('end leagues');

      console.log('start seasons');
      data = await sesaonService.importSeasons(req, res);
      console.log('end seasons');

      console.log('start fantasy teams');
      data = await fantasyTeamService.importFantasyTeams(req, res);
      console.log('end fantasy teams');

      console.log('start transactions');
      data = await transactionService.ImportTransactions(req, res);
      console.log('end transactions');

      console.log('start import season positions');
      data = await seasonPositionService.ImportSeasonPositions(req, res);
      console.log('end import season positions');

      console.log('start ImportStatCategories');
      data = await statCategoryService.ImportStatCategories(req, res);
      console.log('end ImportStatCategories');

      console.log('start ImportStatModifiers');
      data = await seasonStatModifier.ImportSeasonStatModifiers(req, res);
      console.log('end ImportStatModifiers');

      console.log('start ImportMatchups');
      data = await matchupService.ImportMatchupTeam(req, res);
      console.log('end ImportMatchups');

      console.log('start ImportMatchupTeams');
      data = await matchupTeamService.ImportMatchupTeam(req, res);
      console.log('end ImportMatchupTeams');

      console.log('start ImportMatchupCategories');
      data = await matchupCategoryService.ImportMatchupCategories(req, res);
      console.log('end ImportMatchupCategories');

      console.log('start ImportDraft');
      data = await draftService.importDrafts(req, res);
      console.log('end ImportDraft');

      console.log('update FantasyTeam');
      data = await standingsService.ImportStandings(req, res);
      console.log('end FantasyTeam');

      console.log('Unlocking Import...');
      query = 'update importlock set locked = false';
      await pool.query(query);

      data = 'Import Complete';

      return res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      console.log('Unlocking Import...');
      let query = 'update importlock set locked = false';
      await pool.query(query);
      const data = e;
      return res.render('secret.ejs', { data });
    }
  }

  async function importLeagues(req, res) {
    const data = await leagueService.InsertLeagues(req, res);
    res.render('secret.ejs', { data });
  }

  async function importSeasons(req, res) {
    const data = await sesaonService.importSeasons(req, res);
    res.render('secret.ejs', { data });
  }

  async function importTeams(req, res) {
    console.log('Import Teams');
    const data = await fantasyTeamService.importFantasyTeams(req, res);
    res.render('secret.ejs', { data });
  }

  async function importTransactions(req, res) {
    const data = 'Transaction Import Started';
    res.render('secret.ejs', { data });
    try {
      transactionService.ImportTransactions(req, res);
    } catch (e) {
      console.log(e);
    }
  }

  async function ImportSeasonPositions(req, res) {
    // const data = await req.app.yf.team.stats('380.l.1020118.t.1', 10);
    try {
      const data = await seasonPositionService.ImportSeasonPositions(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportStatCategories(req, res) {
    // const data = await req.app.yf.team.stats('380.l.1020118.t.1', 10);
    try {
      const data = await statCategoryService.ImportStatCategories(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportStatModifiers(req, res) {
    try {
      const data = await seasonStatModifier.ImportSeasonStatModifiers(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportMatchups(req, res) {
    // const data = await req.app.yf.team.stats('380.l.1020118.t.1', 10);
    try {
      const data = await matchupService.ImportMatchupTeam(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportMatchupTeams(req, res) {
    try {
      const data = await matchupTeamService.matchupTeamService(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportMatchupCategories(req, res) {
    try {
      const data = await matchupCategoryService.ImportMatchupCategories(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportMatchupRoster(req, res) {
    try {
      const data = await matchupRosterService.ImportMatchupRoster(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportMatchupRosterPlayerStat(req, res) {
    try {
      const data = await matchupRosterPlayStatService.ImportMatchupRosterPlayerStats(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportDrafts(req, res) {
    try {
      const data = await draftService.importDrafts(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  async function ImportStandings(req, res) {
    try {
      const data = await standingsService.ImportStandings(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
      const data = e;
      res.render('secret.ejs', { data });
    }
  }

  return {
    importBothGameTypeAndGame,
    importAll,
    importLeagues,
    importSeasons,
    importTeams,
    importTransactions,
    ImportSeasonPositions,
    ImportStatCategories,
    ImportStatModifiers,
    ImportMatchups,
    ImportMatchupTeams,
    ImportMatchupCategories,
    ImportMatchupRoster,
    ImportMatchupRosterPlayerStat,
    ImportDrafts,
    ImportStandings
  };
}

export default ImportController;
