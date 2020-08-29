import sql from 'sql';

const TransactionType = sql.define({
  name: 'transactiontype',
  columns: [
    'transactiontypeid',
    'transactiontypename'
  ]
});

export default TransactionType;
