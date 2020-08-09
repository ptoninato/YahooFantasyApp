import pool from './db.js';
import transactionModel from '../models/transactionModel.js';
import yahooApiService from './yahooApiService.js';
import playerSerivce from './playerService.js';
import gameCodeTypeService from './gameCodeTypeService.js';

const GetLeagueCodes = async () => {
  try {
    const results = await pool.query('select * from yahooleaguecode');
    return results;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const ImportTransactions = async (req, res) => {
  const leagueCodes = await GetLeagueCodes();
  const gameCodeTypes = await gameCodeTypeService.getAllCodeTypes();
  for (let l = 0; l < leagueCodes.rows.length; l++) {
    const transactions = await yahooApiService.getLeagueTransactions(req, res, leagueCodes.rows[l].leaguecode);
    const leagueCodeType = transactions.data.game_code;
    const dbCodeTypeResults = gameCodeTypes.rows.filter((value) => value.yahoogamecode === leagueCodeType);
    const codeTypeId = dbCodeTypeResults[0].gamecodetypeid;
    const players = await playerSerivce.GetPlayers();
    for (let t = 0; t < transactions.data.transactions.length; t++) {
      const transaction = transactions.data.transactions[t];
      for (let p = 0; p < transaction.players.length; p++) {
        const transactionPlayer = transaction.players[p];
        const existingPlayers = players.rows.filter((value) => value.yahooplayerid === transactionPlayer.player_id && value.gamecodetypeid === codeTypeId);
        if (existingPlayers.length === 0) {
          console.log(transactionPlayer.name.full);
        }
      }
    }
  }
};

export default { GetLeagueCodes, ImportTransactions };
