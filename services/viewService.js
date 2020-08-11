import pool from './db.js';

const GetAllYahooTeamKeys = async (req, res) => {
  try {
    return await pool.query('select * from yahooteamkeys');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetSeasonidLeagueidYahoogamecode = async (req, res) => {
  try {
    return await pool.query('select * from seasonidleagueidyahoogamecode');
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default { GetAllYahooTeamKeys, GetSeasonidLeagueidYahoogamecode };
