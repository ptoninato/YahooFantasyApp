import sql from 'sql';

const LeagueModel = sql.define({
  name: 'league',
  columns: [
    'leagueid',
    'leaguename',
    'gamecodetypeid'
  ]
});

export default LeagueModel;
