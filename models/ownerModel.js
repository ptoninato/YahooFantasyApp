import sql from 'sql';

const Owner = sql.define({
  name: 'owner',
  columns: [
    'ownerid',
    'leagueid',
    'yahooguid',
    'ownername',
    'email',
    'yahoomanagerid'
  ]
});

export default Owner;
