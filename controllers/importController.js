import gameCodeTypeService from '../services/gameCodeTypeService.js';
import gameCodeService from '../services/gameCodeService.js';
import leagueService from '../services/leagueService.js';
import sesaonService from '../services/seasonService.js';
import fantasyTeamService from '../services/fantasyTeamService.js';
import transactionService from '../services/transactionService.js';
import seasonPositionService from '../services/seasonPositionService.js';
import statCategoryService from '../services/statCategoryService.js';
import matchupService from '../services/matchupService.js';
import seasonStatModifier from '../services/seasonStatModifierService.js';
import matchupTeamService from '../services/matchupTeamService.js';
import matchupCategoryService from '../services/matchupCategoryService.js';

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
      console.log('start type');
      let data = await gameCodeTypeService.importGameCodeType(req, res);
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
      data = await matchupService.ImportMatchupTeam(req, res);
      console.log('end ImportMatchupTeams');

      data = 'Import Complete';

      res.render('secret.ejs', { data });
    } catch (e) {
      console.log(e);
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
      const data = await matchupTeamService.ImportMatchupTeam(req, res);
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
    ImportMatchupCategories
  };
}

export default ImportController;
