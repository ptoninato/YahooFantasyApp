import gameCodeTypeService from '../services/gameCodeTypeService.js';
import gameCodeService from '../services/gameCodeService.js';

function ImportController() {
  async function getUserGameFromYahoo(req, res) {
    const returnedData = await req.app.yf.user.games();
    const data = await returnedData.games.reduce((data, game) => {
      if (game.code === 'mlb' || game.code === 'nfl') {
        data.push(game);
      }
      return data;
    }, []);

    return data;
  }

  async function importGameCodeType(req, res) {
    const userData = await getUserGameFromYahoo(req, res);

    const gamecodes = []; const gameCodeOutput = [];
    for (let i = 0; i < userData.length; i++) {
      if (gamecodes[userData[i].code]) continue;
      gamecodes[userData[i].code] = true;
      gameCodeOutput.push({ code: userData[i].code, name: userData[i].name });
    }

    const existingTypes = await gameCodeTypeService.getYahooGameCodes();
    gameCodeOutput.forEach((gamecode) => {
      if (existingTypes.length === 0 || !existingTypes.includes(gamecode.code)) {
        gameCodeTypeService.insertYahooGameCodeType(gamecode);
      }
    });
  }

  async function importGameCode(req, res) {
    const userData = await getUserGameFromYahoo(req, res);

    const gameCodes = await gameCodeService.getYahooGameCodes();
    const allGameCodeTypes = await gameCodeTypeService.getAllCodeTypes();
    let nflTypeId;
    let mlbTypeId;

    for (let i = 0; i < allGameCodeTypes.rows.length; i++) {
      if (allGameCodeTypes.rows[i].yahoogamecode === 'nfl') {
        nflTypeId = allGameCodeTypes.rows[i].gamecodetypeid;
      } else if (allGameCodeTypes.rows[i].yahoogamecode === 'mlb') {
        mlbTypeId = allGameCodeTypes.rows[i].gamecodetypeid;
      }
    }

    const codesToImport = [];
    userData.forEach((code) => {
      if (gameCodes.length === 0 || !gameCodes.includes(code.game_id)) {
        if (code.code === 'nfl') {
          codesToImport.push(
            {
              gamecodetypeid: nflTypeId,
              yahoogamecode: code.game_id,
              season: code.season
            }
          );
        } else if (code.code === 'mlb') {
          codesToImport.push(
            {
              gamecodetypeid: mlbTypeId,
              yahoogamecode: code.game_id,
              season: code.season
            }
          );
        }
      }
    });

    await gameCodeService.insertYahooGameCodeMultiple(codesToImport);

    return codesToImport;
  }

  async function importBothGameTypeAndGame(req, res) {
    let data = await importGameCodeType(req, res);
    data = await importGameCode(req, res);
    res.render('secret.ejs', { data });
  }

  return { importGameCodeType, importGameCode, importBothGameTypeAndGame };
}

export default ImportController;
