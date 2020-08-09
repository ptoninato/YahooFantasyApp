import sql from 'sql';

const Player = sql.define({
  name: 'player',
  columns: [
    'playerid',
    'gamecodetypeid',
    'yahooplayerid',
    'firstname',
    'lastname'
  ]
});

export default Player;
