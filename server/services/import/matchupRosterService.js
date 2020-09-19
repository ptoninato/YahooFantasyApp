import moment from 'moment';
import pool from '../db.js';
import yahooApiService from './yahooApiService.js';
import viewService from '../viewService.js';
import seasonPositionService from './seasonPositionService.js';
import seasonService from './seasonService.js';
import playerService from './playerService.js';
import positionTypeService from './positionTypeService.js';

const skipLeagueCodes = [];
let players;
let positionTypes;
let seasonPositions;
let existingMatchupRosters;

const GetMatchupRosters = async () => {
  const results = await pool.query('select * from matchuproster');
  return results;
};

const ImportPlayerTypeAndPlayer = async (req, res, rosterSpot, yahooTeamCodeFromDb) => {
  let existingPositionType = await positionTypes.rows.filter((x) => x.yahoopositiontype === rosterSpot.position_type && x.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid);
  if (existingPositionType.length === 0) {
    const positiontypetoadd = {
      gamecodetypeid: yahooTeamCodeFromDb.gamecodetypeid,
      yahoopositiontype: rosterSpot.position_type
    };
    console.log(`importing position type ${rosterSpot.position_type}`);
    await positionTypeService.InsertPositionType(positiontypetoadd);
    positionTypes = await positionTypeService.GetPositionTypes();
    existingPositionType = await positionTypes.rows.filter((x) => x.yahoopositiontype === rosterSpot.position_type && x.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid);
  }

  const playerToAdd = {
    gamecodetypeid: yahooTeamCodeFromDb.gamecodetypeid,
    yahooplayerid: rosterSpot.player_id,
    firstname: rosterSpot.name.first,
    lastname: rosterSpot.name.last.length > 0 ? rosterSpot.name.last : 'Defense',
    positiontypeid: existingPositionType[0].positiontypeid
  };
  console.log(`importing Player: ${playerToAdd.firstname} ${playerToAdd.lastname}`);
  await playerService.InsertPlayer(req, res, playerToAdd);
  players = await playerService.GetPlayers();
};

const ImportYahooRoster = async (req, res, rosterFromYahoo, yahooTeamCodeFromDb, season, gamedate) => {
  const { roster } = rosterFromYahoo;

  for (let r = 0; r < roster.length; r++) {
    const rosterSpot = roster[r];
    // console.log(`${rosterSpot.player_id}/${yahooTeamCodeFromDb.gamecodetypeid}`);
    const playersFromDb = players.rows.filter((value) => value.yahooplayerid === Number(rosterSpot.player_id) && value.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid);
    let player;
    if (playersFromDb.length === 0) {
      await ImportPlayerTypeAndPlayer(req, res, rosterSpot, yahooTeamCodeFromDb);
      player = await players.rows.filter((value) => value.yahooplayerid === Number(rosterSpot.player_id) && value.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid)[0];
    } else {
      player = playersFromDb[0];
    }

    const existingMatchupRoster = existingMatchupRosters.rows.filter((value) => value.matchupteamid === yahooTeamCodeFromDb.matchupteamid && value.playerid === player.playerid);

    if (existingMatchupRoster.length === 0) {
      const position = seasonPositions.rows.filter((value) => value.positionname === rosterSpot.selected_position && value.seasonid === season.seasonid)[0];

      const matchuproster = [
        yahooTeamCodeFromDb.matchupteamid,
        player.playerid,
        gamedate,
        position.seasonpositionid
      ];
      console.log(`Adding Roster Spot for ${player.firstname}, ${player.lastname}, ${position.positioname}, ${yahooTeamCodeFromDb.matchupteamid},  ${season.seasonyear}`);
      const query = 'INSERT INTO matchuproster(matchupteamid, playerid, gamedate, seasonpositionid) VALUES($1, $2, $3, $4)';
      const results = await pool.query(query, matchuproster);
    }
  }
};

const dateDifference = async (date, currentDate) => {
  return (currentDate.diff(date, 'days') > 10);
}

const ImportMatchupRoster = async (req, res, currentSeasonsOnly) => {
  let yahooTeamCodes;
  if (currentSeasonsOnly) {
    yahooTeamCodes = await viewService.GetYahooLeagueAndTeamCodesCurrentSeasons();
  } else {
    yahooTeamCodes = await viewService.GetYahooLeagueAndTeamCodes();
  }
  positionTypes = await positionTypeService.GetPositionTypes();
  seasonPositions = await seasonPositionService.GetSeasonPositionsWithYahooCode();
  existingMatchupRosters = await GetMatchupRosters();
  players = await playerService.GetPlayers();
  let apiFetchCount = 0;
  console.log(yahooTeamCodes.rows.length);
  for (let m = 0; m < yahooTeamCodes.rows.length; m++) {
    const yahooTeamCode = yahooTeamCodes.rows[m];
    const seasons = await seasonService.getExistingSeasons();
    const season = seasons.filter((value) => value.gamecodeid === Number(yahooTeamCode.gamecodeid) && value.yahooleagueid === Number(yahooTeamCode.yahooleagueid))[0];
    if (skipLeagueCodes.includes(yahooTeamCode.yahooleagueid)) {
      continue;
    }

    let filterValue;
    let lastValue;
    if (yahooTeamCode.yahoogamecode === 'mlb') {
      filterValue = yahooTeamCode.startdate;
      lastValue = yahooTeamCode.enddate;
      var currentDate = moment().startOf('day');
      for (let d = moment(filterValue); d.isSameOrBefore(lastValue); d.add(1, 'days')) {

        if (await dateDifference(d, currentDate)) {          
          console.log(`Skipping Roster for ${d.format('YYYY-MM-DD')} value ${d}/${moment(lastValue).format('YYYY-MM-DD')}`);
          console.log(currentDate.diff(d, 'days'));
          continue;
        }

        console.log(`Importing Roster for ${d.format('YYYY-MM-DD')} value ${d}/${moment(lastValue).format('YYYY-MM-DD')}`);

        let yahooroster;
        try {
          yahooroster = await yahooApiService.GetRoster(req, res, yahooTeamCode.yahooteamcode, d.format('YYYY-MM-DD'));
          apiFetchCount += 1;
          console.log(apiFetchCount);
        } catch (e) {
          console.log(e);
          try {
            console.log('Waiting');
            await new Promise((resolve) => setTimeout(resolve, 300000));
            yahooroster = await yahooApiService.GetRoster(req, res, yahooTeamCode.yahooteamcode, d.format('YYYY-MM-DD'));
          } catch (e2) {
            console.log(e2);
            console.log(`SKIPPING LEAGUE ${yahooTeamCode.yahooleagueid}`);
            skipLeagueCodes.push(yahooTeamCode.yahooleagueid);
            break;
          }
        }
        await ImportYahooRoster(req, res, yahooroster, yahooTeamCode, season, d.format('YYYY-MM-DD'));
      }
    } else {
      filterValue = yahooTeamCode.weeknumber;
      lastValue = 1;

      // for (let v = filterValue; v <= lastValue; v++) {
      console.log(`Importing Roster for ${yahooTeamCode.yahooteamcode} value ${filterValue}`);
      let yahooroster;
      try {
        yahooroster = await yahooApiService.GetRoster(req, res, yahooTeamCode.yahooteamcode, filterValue);
        apiFetchCount += 1;
        console.log(apiFetchCount);
      } catch (e) {
        console.log(e);
        try {
          console.log('Waiting');
          await new Promise((resolve) => setTimeout(resolve, 500000));
          yahooroster = await yahooApiService.GetRoster(req, res, yahooTeamCode.yahooteamcode, filterValue);
        } catch (e2) {
          console.log(e2);
          console.log(`SKIPPING LEAGUE ${yahooTeamCode.yahooleagueid}`);
          skipLeagueCodes.push(yahooTeamCode.yahooleagueid);
          break;
        }
      }
      console.log('here');
      await ImportYahooRoster(req, res, yahooroster, yahooTeamCode, season, null);
      // }
    }
  }
};

export default {
  ImportMatchupRoster
};
