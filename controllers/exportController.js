import googleService from 'google-spreadsheet';
import creds from '../googleAuth.json'; // the file saved above

const { GoogleSpreadsheet } = googleService;

function ExportController(yf) {
  async function exportPlayers(req, res) {
    const sortType = [
      'AR',
      'OR'
    ];

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_KEY);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets

    const returnData = [];
    for (let i = 0; i < sortType.length; i++) {
      let startIndex = 0;
      let index = 1;

      while (startIndex < 100) {
        const sort = sortType[i];
        console.log(sort, startIndex);
        const data = await yf.players.leagues('mlb.l.51361', { status: 'A', sort, start: startIndex }, ['percent_owned']);
        const sheet = doc.sheetsByIndex[i];
        returnData.push(sheet);
        for (let x = 0; x < data[0].players.length; x++) {
          const currentPlayer = data[0].players[x];
          let percentOwned = 0;
          if (currentPlayer.percent_owned) {
            percentOwned = currentPlayer.percent_owned[1].value;
          } else {
            const playerData = await yf.player.percent_owned(currentPlayer.player_key);
            percentOwned = playerData.percent_owned;
          }

          const body = {
            Number: index,
            Status: currentPlayer.status_full,
            'First Name': currentPlayer.name.first,
            'Last Name': currentPlayer.name.last,
            Position: currentPlayer.primary_position,
            Team: currentPlayer.editorial_team_full_name,
            'Percent Owned': percentOwned
          };
          const row = await sheet.addRow(body);
          index++;
        }
        startIndex += 25;
      }
    }
    const data = returnData;
    res.render('secret.ejs', { data });
  }

  return { exportPlayers };
}

export default ExportController;
