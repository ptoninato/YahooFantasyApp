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

  return importRouter;
}

export default importRoutes;
