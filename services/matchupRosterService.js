import moment from 'moment';
import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import viewService from './viewService.js';
import seasonPositionService from './seasonPositionService.js';
import seasonService from './seasonService.js';
import playerService from './playerService.js';
import positionTypeService from './positionTypeService.js';

const skipLeagueCodes = [];
let players;
let positionTypes;
let seasonPositions;

const ImportYahooRoster = async (req, res, rosterFromYahoo, yahooTeamCodeFromDb) => {
  const { roster } = rosterFromYahoo;
  for (let r = 0; r < roster.length; r++) {
    const rosterSpot = roster[r];
    console.log(`${rosterSpot.player_id}/${yahooTeamCodeFromDb.gamecodetypeid}`);
    let player = players.rows.filter((value) => value.yahooplayerid === Number(rosterSpot.player_id) && value.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid);
    if (player.length === 0) {
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
      player = await players.rows.filter((value) => value.yahooplayerid === Number(rosterSpot.player_id) && value.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid);
    }
  }
};

const ImportMatchupRoster = async (req, res) => {
  const yahooTeamCodes = await viewService.GetYahooLeagueAndTeamCodes();
  positionTypes = await positionTypeService.GetPositionTypes();
  seasonPositions = await seasonPositionService.GetSeasonPositionsWithYahooCode();
  players = await playerService.GetPlayers();
  for (let m = 0; m < yahooTeamCodes.rows.length; m++) {
    const yahooTeamCode = yahooTeamCodes.rows[m];
    const seasons = await seasonService.getExistingSeasons();
    const season = seasons.filter((value) => value.gamecodeid === Number(yahooTeamCode.gamecodeid) && value.yahooleagueid === Number(yahooTeamCode.yahooleagueid))[0];
    if (skipLeagueCodes.includes(yahooTeamCode.yahooleagueid)) {
      console.log('skip');
      continue;
    }

    if (yahooTeamCode.yahoogamecode === 'nfl') {
      continue;
    }

    let filterValue;
    let lastValue;
    if (yahooTeamCode.yahoogamecode === 'mlb') {
      filterValue = yahooTeamCode.startdate;
      lastValue = yahooTeamCode.enddate;

      for (let d = moment(filterValue); d.isSameOrBefore(lastValue); d.add(1, 'days')) {
        console.log(d.format('YYYY-MM-DD'));
        console.log(`Importing Roster for ${d.format('YYYY-MM-DD')} value ${d}/${d.format('YYYY-MM-DD')}`);
        let yahooroster;
        try {
          yahooroster = await yahooApiService.GetRoster(req, res, yahooTeamCode.yahooteamcode, d.format('YYYY-MM-DD'));
        } catch (e) {
          console.log(e);
          skipLeagueCodes.push(yahooTeamCode.yahooleagueid);
          break;
        }
        await ImportYahooRoster(req, res, yahooroster, yahooTeamCode);
      }
    } else {
      filterValue = yahooTeamCode.weeknumber;
      lastValue = 1;

      for (let v = filterValue; v <= lastValue; v++) {
        console.log(`Importing Roster for ${yahooTeamCode.yahooteamcode} value ${filterValue}`);
        let yahooroster;
        try {
          yahooroster = await yahooApiService.GetRoster(req, res, yahooTeamCode.yahooteamcode, v);
        } catch (e) {
          console.log(e);
          skipLeagueCodes.push(yahooTeamCode.yahooleagueid);
          break;
        }

        await ImportYahooRoster(req, res, yahooroster, yahooTeamCode);
      }
    }
  }
};

export default {
  ImportMatchupRoster
};
