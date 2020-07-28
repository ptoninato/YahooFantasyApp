import gameCodeTypeService from '../services/gameCodeTypeService.js';
import gameCodeService from '../services/gameCodeService.js';

function ImportController(yf) {
  async function importGameAndGameType(req, res) {
    const returnedData = await yf.user.games();

    const data = await returnedData.games.reduce((data, game) => {
      if (game.code === 'mlb' || game.code === 'nfl') {
        data.push(game);
      }
      return data;
    }, []);

    const gamecodes = []; const gameCodeOutput = [];
    for (let i = 0; i < data.length; i++) {
      if (gamecodes[data[i].code]) continue;
      gamecodes[data[i].code] = true;
      gameCodeOutput.push({ code: data[i].code, name: data[i].name });
    }

    const existingTypes = await gameCodeTypeService.getYahooGameCodes();
    gameCodeOutput.forEach((gamecode) => {
      if (existingTypes.length === 0 || !existingTypes.includes(gamecode.code)) {
        gameCodeTypeService.insertYahooGameCodeType(gamecode);
      }
    });

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

    data.forEach((code) => {
      if (gameCodes.length === 0 || !gameCodes.includes(code.game_id)) {
        if (code.code === 'nfl') {
          gameCodeService.insertYahooGameCode(nflTypeId, code);
        } else if (code.code === 'mlb') { gameCodeService.insertYahooGameCode(mlbTypeId, code); }
      }
    });

    res.render('secret.ejs', { data });
  }
  return { importGameAndGameType };
}

export default ImportController;
