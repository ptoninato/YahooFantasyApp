import gameCodeTypeService from '../services/gameCodeTypeService.js';
import gameCodeService from '../services/gameCodeService.js';

function ImportController() {
  async function importBothGameTypeAndGame(req, res) {
    console.log('start type');
    let data = await gameCodeTypeService.importGameCodeType(req, res);
    console.log('start gamecode');
    data = await gameCodeService.importGameCode(req, res);
    res.render('secret.ejs', { data });
  }

  return { importBothGameTypeAndGame };
}

export default ImportController;
