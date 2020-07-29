import express from 'express';
import ControllerImport from '../controllers/importController.js';

const importRouter = express.Router();

function importRoutes(yf) {
  const controller = new ControllerImport(yf);

  importRouter.route('/importGameCodeAndType')
    .get(controller.importGameAndGameType);

  return importRouter;
}

export default importRoutes;
