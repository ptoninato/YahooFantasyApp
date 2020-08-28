import fs from 'fs';
import moment from 'moment';
import opn from 'opn';
import pool from './db.js';
import yahooApiService from './yahooApiService.js';

let existingMatchupPlayerStats;

const GetMatchupRosterPlayerStat = async () => {
  const results = await pool.query('select * from matchuprosterplayerstat');
  return results;
};

const GetStatCategorySeasonIdYahooCategoryId = async () => {
  const results = await pool.query(`select s.seasonstatcategoryid, s.seasonid, s2.name, s2.yahoocategoryid from seasonstatcategory s 
    join seasonstatcategorytype s2 on s.seasonstatcategorytypeid = s2.seasonstatcategorytypeid 
    join gamecodetype gt on s2.gamecodetypeid = gt.gamecodetypeid
    where gt.yahoogamecode = 'nfl'
  `);
  return results;
};

const MatchupRosterToImport = async () => {
  const results = await pool.query(`select m.matchuprosterid, s.seasonyear, s2.weeknumber, f2.teamname, CONCAT(p2.firstname, ' ', p2.lastname) as Name, p2.yahooplayerid, g.yahoogamecode, s2.weeknumber, s.seasonid from matchuproster m 
  join player p2 on m.playerid = p2.playerid 
  join matchupteam m2 on m.matchupteamid = m2.matchupteamid 
  join fantasyteam f2 on m2.fantasyteamid = f2.fantasyteamid 
  join matchup m3 on m2.matchupid = m3.matchupid 
  join seasonweek s2 on m3.seasonweekid = s2.seasonweekid 
  join season s on m3.seasonid = s.seasonid 
  join gamecode g on s.gamecodeid = g.gamecodeid 
  join gamecodetype g2 on g.gamecodetypeid = g2.gamecodetypeid 
  where g2.yahoogamecode = 'nfl' and m.matchuprosterid not in (select distinct m4.matchuprosterid from matchuprosterplayerstat m4)`);
  return results;
};

const ImportMatchupRosterPlayerStats = async (req, res) => {
  existingMatchupPlayerStats = await GetMatchupRosterPlayerStat();
  const RecordsToImport = await MatchupRosterToImport();
  const existingSeasonStats = await GetStatCategorySeasonIdYahooCategoryId();

  // const zeroList = await readFile();
  const data = fs.readFileSync('zeroPlayers.json');
  const zeroList = JSON.parse(data);

  for (let x = 0; x < RecordsToImport.rows.length; x++) {
    const record = RecordsToImport.rows[x];
    const {
      weeknumber, yahoogamecode, yahooplayerid, matchuprosterid
    } = record;
    const playerKey = `${yahoogamecode}.p.${yahooplayerid}`;

    const isInDoNotQueryList = zeroList.filter((value) => value.playerKey === playerKey && value.weeknumber === weeknumber);

    if (isInDoNotQueryList.length !== 0) {
      console.log(`skipping ${playerKey} for week ${weeknumber}`);
      continue;
    }

    let statsFromYahoo;
    try {
      statsFromYahoo = await yahooApiService.GetPlayerStats(req, res, playerKey, weeknumber);
    } catch (e) {
      console.log(e);
      const datetime = moment(Date.now()).format('dddd, MMMM Do YYYY, h:mm:ss a');
      console.log(`Zero Length Count: ${zeroList.length}`);
      console.log(`Waiting started at ${datetime}`);
      await new Promise((resolve) => setTimeout(resolve, 100000));
      opn('https://75fddb8f7cd4.ngrok.io/auth/yahoo');
      break;
    }
    console.log(`${playerKey}, ${weeknumber}`);

    const notZeroStats = statsFromYahoo.stats.stats.filter((value) => value.value !== 0 && value.value !== '0');

    if (notZeroStats.length === 0) {
      fs.readFile('zeroPlayers.json', (err, data2) => {
        const json = JSON.parse(data2);
        const row = { playerKey, weeknumber };
        json.push(row);

        fs.writeFile('zeroPlayers.json', JSON.stringify(json), (err2) => {
          if (err2) throw err2;
          console.log(`Not Zero Stats: ${playerKey}, ${weeknumber}`);
        });
      });
      continue;
    }
    let statsAdded = 0;
    for (let s = 0; s < statsFromYahoo.stats.stats.length; s++) {
      const stat = statsFromYahoo.stats.stats[s];
      if (stat.value === 0 || stat.value === '0') {
        continue;
      }
      const statFromDb = existingSeasonStats.rows.filter((value) => value.yahoocategoryid === Number(stat.stat_id))[0];
      if (statFromDb !== undefined) {
        statsAdded += 1;

        const existingStat = existingMatchupPlayerStats.rows.filter((value) => value.matchuprosterid === matchuprosterid && value.seasonstatcategoryid === statFromDb.seasonstatcategoryid);
        if (existingStat.length === 0) {
          const newMatchupStat = [
            matchuprosterid,
            statFromDb.seasonstatcategoryid,
            stat.value
          ];
          console.log(`Adding ${statFromDb.name} for ${record.name}, ${record.teamname}, ${record.weeknumber}, ${record.seasonyear}`);
          const query = 'INSERT INTO matchuprosterplayerstat(matchuprosterid, seasonstatcategoryid, value) VALUES($1, $2, $3)';
          const results = await pool.query(query, newMatchupStat);
        }
      }
    }

    if (statsAdded === 0) {
      fs.readFile('zeroPlayers.json', (err, data2) => {
        const json = JSON.parse(data2);
        const row = { playerKey, weeknumber };
        json.push(row);

        fs.writeFile('zeroPlayers.json', JSON.stringify(json), (err2) => {
          if (err2) throw err2;
          console.log(`Not Zero Stats: ${playerKey}, ${weeknumber}`);
        });
      });
      continue;
    }
  }
};

export default {
  ImportMatchupRosterPlayerStats
};
