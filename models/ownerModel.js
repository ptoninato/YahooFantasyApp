import sql from 'sql';

const Owner = sql.define({
  name: 'owner',
  columns: [
    'ownerid',
    'leagueid',
    'yahooguid',
    'email'
  ]
});

export default Owner;
