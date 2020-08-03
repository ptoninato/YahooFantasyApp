import gameCodeTypeService from '../services/gameCodeTypeService.js';
import gameCodeService from '../services/gameCodeService.js';
import leagueService from '../services/leagueService.js';
import sesaonService from '../services/seasonService.js';
import fantasyTeamService from '../services/fantasyTeamService.js';

function ImportController() {
  async function importBothGameTypeAndGame(req, res) {
    console.log('start type');
    let data = await gameCodeTypeService.importGameCodeType(req, res);
    console.log('start gamecode');
    data = await gameCodeService.importGameCode(req, res);
    res.render('secret.ejs', { data });
  }

  async function importAll(req, res) {
    console.log('start type');
    let data = await gameCodeTypeService.importGameCodeType(req, res);
    data = await gameCodeService.importGameCode(req, res);
    data = await leagueService.InsertLeagues(req, res);
    data = await sesaonService.importSeasons(req, res);
    res.render('secret.ejs', { data });
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

  return {
    importBothGameTypeAndGame,
    importAll,
    importLeagues,
    importSeasons,
    importTeams
  };
}

export default ImportController;
