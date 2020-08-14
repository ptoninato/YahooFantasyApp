import pool from './db.js';
import playerModel from '../models/playerModel.js';

const GetPlayers = async () => {
  try {
    const results = await pool.query('select * from player');
    return results;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const InsertPlayer = async (req, res, player) => {
  try {
    const query = playerModel.insert(player).returning(playerModel.playerid).toQuery();
    const { rows } = await pool.query(query);
    return rows;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default { GetPlayers, InsertPlayer };
