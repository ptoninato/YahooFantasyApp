import sql from 'sql';

const GameCode = sql.define({
  name: 'gamecode',
  columns: [
    'gamecodeid',
    'gamecodetypeid',
    'yahoogamecode',
    'season'
  ]
});

export default GameCode;
