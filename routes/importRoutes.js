import express from 'express';
import service from '../services/gameCodeTypeService.js';

function importRoutes(yf) {
  const importRouter = express.Router();

  importRouter.use('/importGameCodeAndType', async (req, res, next) => {
    const returnedData = await yf.user.games();

    const data = await returnedData.games.reduce((data, game) => {
      if (game.code === 'mlb' || game.code === 'nfl') {
        data.push(game);
      }
      return data;
    }, []);

    console.log(data.length);

    const gamecodes = []; const gameCodeOutput = [];
    for (let i = 0; i < data.length; i++) {
      if (gamecodes[data[i].code]) continue;
      gamecodes[data[i].code] = true;
      gameCodeOutput.push({ code: data[i].code, name: data[i].name });
    }

    const existingTypes = await service.getYahooGameCodes();
    console.log(existingTypes);

    gameCodeOutput.forEach((gamecode) => {
      if (existingTypes.length === 0 || !existingTypes.includes(gamecode.code)) {
        service.insertYahooGameCodes(gamecode);
      }
    });

    res.render('secret.ejs', { data });
  });

  return importRouter;
}

export default importRoutes;
