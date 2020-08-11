import pool from './db.js';
import transactionModel from '../models/transactionModel.js';
import yahooApiService from './yahooApiService.js';
import playerSerivce from './playerService.js';
import gameCodeTypeService from './gameCodeTypeService.js';
import transactionTypeService from './transactionTypeService.js';
import seasonService from './seasonService.js';
import viewService from './viewService.js';

const GetLeagueCodes = async () => {
  try {
    const results = await pool.query('select * from yahooleaguecode');
    return results;
  } catch (e) {
    console.log(e);
    return e;
  }
};

async function InsertTransactions(transactions) {
  try {
    const query = transactionModel.insert(transactions).returning(transactionModel.transactionid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows.length);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

const ImportTransactions = async (req, res) => {
  const leagueCodes = await GetLeagueCodes();
  const gameCodeTypes = await gameCodeTypeService.getAllCodeTypes();
  const seasons = await viewService.GetSeasonidLeagueidYahoogamecode();
  const teams = await viewService.GetAllYahooTeamKeys();
  let transactionsToImport = [];
  for (let l = 0; l < leagueCodes.rows.length; l++) {
    const transactions = await yahooApiService.getLeagueTransactions(req, res, leagueCodes.rows[l].leaguecode);
    const leagueCodeType = transactions.data.game_code;
    const dbCodeTypeResults = gameCodeTypes.rows.filter((value) => value.yahoogamecode === leagueCodeType);
    const codeTypeId = dbCodeTypeResults[0].gamecodetypeid;
    console.log(transactions.data.league_id);
    const season = seasons.rows.filter((x) => x.yahooleagueid === Number(transactions.data.league_id));
    const seasonId = season[0].seasonid;
    for (let t = 0; t < transactions.data.transactions.length; t++) {
      const transaction = transactions.data.transactions[t];
      for (let p = 0; p < transaction.players.length; p++) {
        const transactionPlayer = transaction.players[p];
        let playersFromDb = await playerSerivce.GetPlayers();
        let transactionTypesFromDb = await transactionTypeService.GetTransactionTypes();
        let existingPlayers = await playersFromDb.rows.filter((x) => x.yahooplayerid === Number(transactionPlayer.player_id) && x.gamecodetypeid === codeTypeId);
        if (existingPlayers.length === 0) {
          const playerToAdd = {
            gamecodetypeid: codeTypeId,
            yahooplayerid: transactionPlayer.player_id,
            firstname: transactionPlayer.name.first,
            lastname: transactionPlayer.name.last.length > 0 ? transactionPlayer.name.last : 'Defense'
          };
          await playerSerivce.InsertPlayer(req, res, playerToAdd);
          playersFromDb = await playerSerivce.GetPlayers();
          existingPlayers = await playersFromDb.rows.filter((x) => x.yahooplayerid === Number(transactionPlayer.player_id) && x.gamecodetypeid === codeTypeId);
        }
        let existingTransactionTypes = await transactionTypesFromDb.rows.filter((x) => x.transactiontypename === transactionPlayer.transaction.type);
        if (existingTransactionTypes.length === 0) {
          const typeToAdd = {
            transactiontypename: transactionPlayer.transaction.type
          };
          await transactionTypeService.InsertTransactionType(req, res, typeToAdd);
          transactionTypesFromDb = await transactionTypeService.GetTransactionTypes();
          existingTransactionTypes = await transactionTypesFromDb.rows.filter((x) => x.transactiontypename === transactionPlayer.transaction.type);
        }

        let fantasyteam;
        let tradefromteam;
        if (transactionPlayer.transaction.type === 'add') {
          fantasyteam = teams.rows.filter((x) => x.team_key === transactionPlayer.transaction.destination_team_key);
        } else if (transactionPlayer.transaction.type === 'drop') {
          fantasyteam = teams.rows.filter((x) => x.team_key === transactionPlayer.transaction.source_team_key);
        } else if (transactionPlayer.transaction.type === 'trade') {
          fantasyteam = teams.rows.filter((x) => x.team_key === transactionPlayer.transaction.destination_team_key);
          tradefromteam = teams.rows.filter((x) => x.team_key === transactionPlayer.transaction.source_team_key);
        }
        const transactionToImport = {
          seasonid: seasonId,
          fantasyteamid: fantasyteam[0].fantasyteamid,
          playerid: existingPlayers[0].playerid,
          transactiontypeid: existingTransactionTypes[0].transactiontypeid,
          yahootransactionid: transaction.transaction_id,
          tradefromteamid: tradefromteam ? tradefromteam[0].fantasyteamid : null,
          transactiondate: new Date(Number(transaction.timestamp) * 1000)
        };
        transactionsToImport.push(transactionToImport);
      }

      if (transactionsToImport.length > 0) {
        await InsertTransactions(transactionsToImport);
        transactionsToImport = [];
      }
    }
  }

  return transactionsToImport;
};

export default { GetLeagueCodes, ImportTransactions };
