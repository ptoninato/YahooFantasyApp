async function getUserGameFromYahoo(req, res) {
  const returnedData = await req.app.yf.user.games();
  const codes = await returnedData.games.reduce((data, game) => {
    if (game.code === 'mlb' || game.code === 'nfl') {
      data.push(game);
    }
    return data;
  }, []);

  res.data = codes;

  return res;
}

async function getUserLeaguesFromYahoo(req, res, gameCodes) {
  const returnedData = await req.app.yf.user.game_leagues(gameCodes);
  res.data = returnedData;
  return res;
}

async function getLeagueTeams(req, res, leaguekey) {
  const returnData = await req.app.yf.league.teams(leaguekey);
  res.data = returnData;
  return res;
}

async function getLeagueTransactions(req, res, leaguekey) {
  const returnData = await req.app.yf.league.transactions(leaguekey);
  res.data = returnData;
  return res;
}

async function getLeagueSettings(req, res, leaguekey) {
  const returnData = await req.app.yf.league.settings(leaguekey);
  res.data = returnData;
  return res;
}

async function getLeagueScoreboardByWeek(req, res, leaguekey, week) {
  const returnData = await req.app.yf.league.scoreboard(leaguekey, week);
  return returnData;
}

async function GetRoster(req, res, teamkey, weekOrDay) {
  const returnData = await req.app.yf.roster.players(teamkey, weekOrDay);
  return returnData;
}

async function GetPlayerStats(req, res, playerKey, week) {
  const returnData = await req.app.yf.player.stats(playerKey, week);
  return returnData;
}

async function GetDraft(req, res, leagueKey) {
  const returnData = await req.app.yf.league.draft_results(leagueKey);
  return returnData;
}

async function GetPlayer(req, res, playerKey) {
  const returnData = await req.app.yf.player.meta(playerKey);
  return returnData;
}

async function GetStandings(req, res, leagueKey) {
  const returnData = await req.app.yf.league.standings(leagueKey);
  return returnData;
}

export default {
  getUserGameFromYahoo,
  getUserLeaguesFromYahoo,
  getLeagueTeams,
  getLeagueTransactions,
  getLeagueSettings,
  getLeagueScoreboardByWeek,
  GetRoster,
  GetPlayerStats,
  GetDraft,
  GetPlayer,
  GetStandings
};
