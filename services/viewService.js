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

const GetYahooLeagueCodes = async (req, res) => {
  try {
    return await pool.query('select * from yahooleaguecode');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetYahooLeagueAndTeamCodes = async (req, res) => {
  try {
    return await pool.query('select * from yahooleagueandteamcodes');
  } catch (e) {
    console.log(e);
    return e;
  }
};


export default { GetAllYahooTeamKeys, GetSeasonidLeagueidYahoogamecode, GetYahooLeagueCodes, GetYahooLeagueAndTeamCodes };
