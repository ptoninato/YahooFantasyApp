import moment from 'moment';
import pool from '../services/db.js';

function TransactionSearchController() {
  const GetAllPlayers = async (req, res) => {
    console.log('here');
    const queryResult = await pool.query(`select p.playerid as id, CONCAT(p.firstname, ' ', p.lastname, ', ', upper(g.yahoogamecode)) as Name from player p
    join gamecodetype g on p.gamecodetypeid = g.gamecodetypeid 
    order by name asc`);
    console.log(queryResult.rows);
    console.log(`Request Received ${moment(Date.now())}`);
    return res.json(queryResult.rows);
  };

  const GetCountsByPlayerId = async (req, res) => {
    console.log(req);
    return res.json(req.body);
  };

  return {
    GetAllPlayers,
    GetCountsByPlayerId
  };
}

export default TransactionSearchController;
