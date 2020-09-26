import moment from 'moment';
import pool from '../services/db.js';
import viewService from '../services/viewService.js';

function TransactionSearchController() {
  const GetAllPlayers = async (req, res) => {
    console.log('here');
    const playerQueryResult = await pool.query(`select p.playerid as id, CONCAT(p.firstname, ' ', p.lastname, ', ', upper(g.yahoogamecode)) as Name from player p
    join gamecodetype g on p.gamecodetypeid = g.gamecodetypeid 
    order by name asc`);
    const leagueQueryResults = await pool.query('select distinct t.leagueid, t.leaguename from transactioncounts t');
    console.log(`Request Received ${moment(Date.now())}`);
    return res.json([{ players: playerQueryResult.rows, league: leagueQueryResults.rows }]);
  };

  const GetCountsByPlayerId = async (req, res) => {
    const ids = req.body;
    const data = await viewService.GetTransactionCountsByPlayerId(req, res, ids);
    return res.json(data.rows);
  };

  const GetTopPlayersMLB = async (req, res) => {
    const data = await viewService.GetTopTransactionsForMlb(req, res, [100]);
    return res.json(data.rows);
  };

  return {
    GetAllPlayers,
    GetCountsByPlayerId,
    GetTopPlayersMLB
  };
}

export default TransactionSearchController;
