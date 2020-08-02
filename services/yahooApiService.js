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

export default { getUserGameFromYahoo };
