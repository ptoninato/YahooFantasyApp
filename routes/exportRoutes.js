import express from 'express';
import ControllerExport from '../controllers/exportController.js';

const exportRouter = express.Router();

function exportRoutes(yf) {
  const controller = new ControllerExport(yf);

  exportRouter.route('/exportPlayers')
    .get(controller.exportPlayers);

  return exportRouter;
}

export default exportRoutes;
