import sql from 'sql';

const Transaction = sql.define({
  name: 'transaction',
  columns: [
    'transacitonid',
    'fantasyteamid',
    'seasonid',
    'ownerid',
    'playerid',
    'yahootransactionid'
  ]
});

export default Transaction;
