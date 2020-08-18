import gameCodeTypeService from '../services/gameCodeTypeService.js';
import gameCodeService from '../services/gameCodeService.js';
import leagueService from '../services/leagueService.js';
import sesaonService from '../services/seasonService.js';
import fantasyTeamService from '../services/fantasyTeamService.js';
import transactionService from '../services/transactionService.js';
import matchupService from '../services/matchupService.js';

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
    const data = await transactionService.ImportTransactions(req, res);
    res.render('secret.ejs', { data });
  }

  async function importMatchups(req, res) {
    // const data = await req.app.yf.team.stats('380.l.1020118.t.1', 10);
    try {
      const data = await matchupService.importMatchups(req, res);
      res.render('secret.ejs', { data });
    } catch (e) {
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
    importMatchups
  };
}

export default ImportController;
