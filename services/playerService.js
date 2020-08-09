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

export default { GetPlayers };
