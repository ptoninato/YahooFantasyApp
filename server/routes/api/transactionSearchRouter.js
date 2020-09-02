import express from 'express';
import TransactionSearchController from '../../controllers/transactionSearchController.js';

const transactionSearchRouter = express.Router();

function transactionSearchRoutes(req, res) {
  const controller = new TransactionSearchController();

  transactionSearchRouter.route('/getAllPlayers').get(controller.GetAllPlayers);

  return transactionSearchRouter;
}

export default transactionSearchRoutes;
