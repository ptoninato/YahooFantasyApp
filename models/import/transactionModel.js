import sql from 'sql';

const Transaction = sql.define({
  name: 'transaction',
  columns: [
    'transactionid',
    'seasonid',
    'fantasyteamid',
    'playerid',
    'transactiontypeid',
    'yahootransactionid',
    'tradefromteamid',
    'transactiondate'
  ]
});

export default Transaction;
