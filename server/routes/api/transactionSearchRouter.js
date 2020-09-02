import express from 'express';
import TransactionSearchController from '../../controllers/transactionSearchController.js';

const transactionSearchRouter = express.Router();

function transactionSearchRoutes() {
  const controller = new TransactionSearchController();

  transactionSearchRouter.route('/getAllPlayers').get(controller.GetAllPlayers);

  transactionSearchRouter.route('/getCountById').get(controller.GetCountsByPlayerId);

  return transactionSearchRouter;
}

export default transactionSearchRoutes;
