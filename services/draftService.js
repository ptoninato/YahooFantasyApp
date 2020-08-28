import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import viewService from './viewService.js';
import seasonService from './seasonService.js';
import playerService from './playerService.js';
import gamecodeService from './gameCodeService.js';
import positionTypeService from './positionTypeService.js';

const GetDraftPicks = async () => {
  const results = await pool.query('select * from draftpick');
  return results;
};

const GetDrafts = async () => {
  const results = await pool.query('select * from draft');
  return results;
};

let existingDrafts;
let existingDraftPicks;
let players;
let leagueCodes;
let seasons;
let gamecodes;
let positionTypes;
let teams;

const ImportPlayerTypeAndPlayer = async (req, res, playerMeta, yahooTeamCodeFromDb) => {
  console.log(playerMeta);
  let existingPositionType = await positionTypes.rows.filter((x) => x.yahoopositiontype === playerMeta.position_type && x.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid);
  if (existingPositionType.length === 0) {
    const positiontypetoadd = {
      gamecodetypeid: yahooTeamCodeFromDb.gamecodetypeid,
      yahoopositiontype: playerMeta.position_type
    };
    console.log(`importing position type ${playerMeta.position_type}`);
    await positionTypeService.InsertPositionType(positiontypetoadd);
    positionTypes = await positionTypeService.GetPositionTypes();
    existingPositionType = await positionTypes.rows.filter((x) => x.yahoopositiontype === playerMeta.position_type && x.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid);
  }

  const playerToAdd = {
    gamecodetypeid: yahooTeamCodeFromDb.gamecodetypeid,
    yahooplayerid: playerMeta.player_id,
    firstname: playerMeta.name.first,
    lastname: playerMeta.name.last.length > 0 ? playerMeta.name.last : 'Defense',
    positiontypeid: existingPositionType[0].positiontypeid
  };
  console.log(`importing Player: ${playerToAdd.firstname} ${playerToAdd.lastname}`);
  await playerService.InsertPlayer(req, res, playerToAdd);
  players = await playerService.GetPlayers();
};

const importDrafts = async (req, res) => {
  existingDrafts = await GetDrafts();
  existingDraftPicks = await GetDraftPicks();
  teams = await viewService.GetAllYahooTeamKeys();
  players = await playerService.GetPlayers();
  leagueCodes = await viewService.GetYahooLeagueCodes();
  seasons = await seasonService.getExistingSeasons();
  gamecodes = await gamecodeService.getAllGameCodes();
  positionTypes = await positionTypeService.GetPositionTypes();
  for (let d = 0; d < leagueCodes.rows.length; d++) {
    const leagueCode = await leagueCodes.rows[d];
    const splitLeagueCode = leagueCode.leaguecode.split('.');
    const yahoogamecode = splitLeagueCode[0];
    const yahooleagueid = splitLeagueCode[2];
    const gamecodeFilter = gamecodes.rows.filter((value) => value.yahoogamecode === yahoogamecode);
    const gamecode = gamecodeFilter[0];
    const seasonFilter = await seasons.filter((value) => value.gamecodeid === Number(gamecode.gamecodeid) && value.yahooleagueid === Number(yahooleagueid));
    const season = seasonFilter[0];

    let draftFromYahoo;

    try {
      draftFromYahoo = await yahooApiService.GetDraft(req, res, leagueCode.leaguecode);
    } catch (e) {
      continue;
    }

    let existingDraft = existingDrafts.rows.filter((value) => value.seasonid === season.seasonid);

    if (existingDraft.length === 0) {
      const firstPick = draftFromYahoo.draft_results[0];
      const auctiondraft = firstPick.cost !== undefined ?? false;
      const newDraft = [
        season.seasonid,
        auctiondraft
      ];
      console.log(`Adding Draft for ${leagueCode.name} in ${season.seasonyear}`);
      const query = 'INSERT INTO draft(seasonid, auctiondraft) VALUES($1, $2)';
      const results = await pool.query(query, newDraft);
      existingDrafts = await GetDrafts();
      existingDraft = existingDrafts.rows.filter((value) => value.seasonid === season.seasonid);
    }

    const draft = existingDraft[0];

    const picks = draftFromYahoo.draft_results;

    for (let p = 0; p < picks.length; p++) {
      const pick = picks[p];

      const yahooPlayerId = pick.player_key.split('.p.').pop();

      let playerFromDb = players.rows.filter((value) => value.yahooplayerid === Number(yahooPlayerId) && value.gamecodetypeid === gamecode.gamecodetypeid);

      if (playerFromDb.length === 0) {
        console.log(pick);
        const playerMeta = await yahooApiService.GetPlayer(req, res, pick.player_key);
        await ImportPlayerTypeAndPlayer(req, res, playerMeta, gamecode);
        players = await playerService.GetPlayers();
        playerFromDb = players.rows.filter((value) => value.yahooplayerid === Number(yahooPlayerId) && value.gamecodetypeid === gamecode.gamecodetypeid);
      }
      const player = playerFromDb[0];

      const dbTeam = teams.rows.filter((value) => value.team_key === pick.team_key)[0];

      const existingPick = existingDraftPicks.rows.filter((value) => value.fantasyteamid === dbTeam.fantasyteamid && value.draftid === draft.draftid && value.playerid === player.playerid);

      if (existingPick.length === 0) {
        const cost = pick.cost ?? null;

        const newPick = [
          draft.draftid,
          pick.round,
          pick.pick,
          player.playerid,
          cost,
          dbTeam.fantasyteamid
        ];

        if (cost !== null) {
          console.log(`Round: ${pick.round}/pick: ${pick.pick}: ${dbTeam.teamname} drafted ${player.firstname} ${player.lastname} for ${cost} in ${season.seasonyear}`);
        } else {
          console.log(`Round: ${pick.round}/pick: ${pick.pick}: ${dbTeam.teamname} drafted ${player.firstname} ${player.lastname} in ${season.seasonyear}`);
        }
        const query = 'INSERT INTO draftpick(draftid, round, pick, playerid, cost, fantasyteamid) VALUES($1, $2, $3, $4, $5, $6)';
        const results = await pool.query(query, newPick);
      }
    }
  }
};

export default {
  importDrafts
}