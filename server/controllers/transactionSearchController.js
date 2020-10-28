import moment from 'moment';
import pool from '../services/db.js';
import viewService from '../services/viewService.js';

function TransactionSearchController() {
  const GetAllPlayers = async (req, res) => {
    const playerQueryResult = await pool.query(`select p.playerid as id, CONCAT(p.firstname, ' ', p.lastname, ', ', upper(g.yahoogamecode)) as Name from player p
    join gamecodetype g on p.gamecodetypeid = g.gamecodetypeid 
    order by name asc`);
    const leagueQueryResults = await pool.query('select distinct t.leagueid, t.leaguename from transactioncounts t');
    console.log(`Request Received ${moment(Date.now())}`);
    return res.json([{ players: playerQueryResult.rows, league: leagueQueryResults.rows }]);
  };

  const GetCountsByPlayerId = async (req, res) => {
    console.log(req.body.leagueId);
    const playerIds = req.body.playerId;
    const leagueId = req.body.leagueId;
    const data = await viewService.GetTransactionCountsByPlayerId(req, res, playerIds, leagueId);
    return res.json(data.rows);
  };

  const GetTopPlayersMLB = async (req, res) => {
    const data = await viewService.GetTopTransactionsForMlb(req, res, [100]);
    return res.json(data.rows);
  };

  const GetPlayersByLeague = async (req, res) => {
    console.log(req.res);
    const data = await viewService.GetTopTransactionsForMlb(req, res, [100]);
    return res.json(data.rows);
  };

  return {
    GetAllPlayers,
    GetCountsByPlayerId,
    GetTopPlayersMLB,
    GetPlayersByLeague
  };
}

export default TransactionSearchController;
