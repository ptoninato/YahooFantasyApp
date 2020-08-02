import sql from 'sql';

const SeasonModel = sql.define({
  name: 'season',
  columns: [
    'seasonid',
    'leagueid',
    'yahooleagueid',
    'startdate',
    'enddate',
    'seasonyear',
    'scoringtype',
    'firstweek',
    'lastweek'
  ]
});

export default SeasonModel;
