import sql from 'sql';

const PositionType = sql.define({
  name: 'positiontype',
  columns: [
    'positiontypeid',
    'yahoopositiontype',
    'gamecodetypeid'
  ]
});

export default PositionType;
