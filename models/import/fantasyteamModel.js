import sql from 'sql';

const FantasyTeam = sql.define({
  name: 'fantasyteam',
  columns: [
    'fantasyteamid',
    'leagueid',
    'seasonid',
    'ownerid',
    'yahooteamid',
    'teamname'
  ]
});

export default FantasyTeam;
