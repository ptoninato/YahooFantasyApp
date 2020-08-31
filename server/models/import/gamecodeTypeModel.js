import sql from 'sql';

const GameCodeType = sql.define({
  name: 'gamecodetype',
  columns: [
    'gamecodetypeid',
    'yahoogamecode',
    'yahoogamename'
  ]
});

export default GameCodeType;
