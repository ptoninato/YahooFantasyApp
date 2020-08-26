import express from 'express';
import ControllerImport from '../controllers/importController.js';

const importRouter = express.Router();

function importRoutes(req, res) {
  const controller = new ControllerImport();

  importRouter.route('/importGameCodeAndType')
    .get(controller.importBothGameTypeAndGame);

  importRouter.route('/importAll')
    .get(controller.importAll);

  importRouter.route('/importLeagues')
    .get(controller.importLeagues);

  importRouter.route('/importSeasons')
    .get(controller.importSeasons);

  importRouter.route('/importTeams')
    .get(controller.importTeams);

  importRouter.route('/importTransactions')
    .get(controller.importTransactions);

  importRouter.route('/importSeasonPositions')
    .get(controller.ImportSeasonPositions);

  importRouter.route('/importStatCategories')
    .get(controller.ImportStatCategories);

  importRouter.route('/importStatModifiers')
    .get(controller.ImportStatModifiers);

  importRouter.route('/importMatchups')
    .get(controller.ImportMatchups);

  importRouter.route('/importMatchupTeams')
    .get(controller.ImportMatchupTeams);

  importRouter.route('/importMatchupCategories')
    .get(controller.ImportMatchupCategories);

  return importRouter;
}

export default importRoutes;
