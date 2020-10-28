import pool from './db.js';

const GetAllYahooTeamKeys = async () => {
  try {
    return await pool.query('select * from yahooteamkeys');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetSeasonidLeagueidYahoogamecode = async () => {
  try {
    return await pool.query('select * from seasonidleagueidyahoogamecode');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetYahooLeagueCodes = async () => {
  try {
    return await pool.query('select * from yahooleaguecode');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetYahooLeagueAndTeamCodes = async () => {
  try {
    return await pool.query('select * from yahooleagueandteamcodes');
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetYahooLeagueAndTeamCodesCurrentSeasons = async () => pool.query('select * from yahooleagueandteamcodes where seasonyear >= ALL(select seasonyear from season) order by seasonyear');

const GetTransactionCountsByPlayerId = async (req, res, playerIds, leagueId) => {
  console.log(playerIds);
  console.log(leagueId);
  const results = pool.query('select * from transactioncounts WHERE playerid = ANY($1::int[]) and leagueid = $2', [playerIds, leagueId]);
  return results;
};

const GetTopTransactionsForMlb = async (req, res, count) => {
  console.log(count);
  return pool.query('select * from transactioncountsmlb limit $1', count);
};

const GetCurrentSeasonLeagueCodes = async () => {
  try {
    const results = await pool.query('select * from yahooleaguecode y WHERE season >= ALL(select seasonyear from season)');
    return results;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default {
  GetAllYahooTeamKeys,
  GetSeasonidLeagueidYahoogamecode,
  GetYahooLeagueCodes,
  GetYahooLeagueAndTeamCodes,
  GetTransactionCountsByPlayerId,
  GetTopTransactionsForMlb,
  GetCurrentSeasonLeagueCodes,
  GetYahooLeagueAndTeamCodesCurrentSeasons
};
