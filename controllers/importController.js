import app from 'express';
import gameCodeTypeService from '../services/gameCodeTypeService.js';

function importController() {
  async function importGameAndGameType(req, res) {
    const returnedData = await app.yf.user.games();

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
        gameCodeTypeService.insertYahooGameCodes(gamecode);
      }
    });

    res.render('secret.ejs', { data });
  }

  return { importGameAndGameType };
}

export default importController;
