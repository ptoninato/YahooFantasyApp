import pool from './db.js';
import yahooApiService from './yahooApiService.js';
import viewService from './viewService.js';
import seasonService from './seasonService.js';
import gamecodeService from './gameCodeService.js';
import seasonRosterPositionService from './rosterPositionService.js';
import positionTypeService from './positionTypeService.js';
import seasonPositionService from './seasonPositionService.js';

const GetSeasonStatModifer = async () => {
  const results = await pool.query('select * from seasonstatmodifier');
  return results;
};

const ImportSeasonStatModifiers = async (req, res) => {
  const existingModifiers = await GetSeasonStatModifer();
  const existingSeasonPosition = seasonPositionService.GetSeasonPosition();
  const leagueCodes = await viewService.GetYahooLeagueCodes();

  for (let c = 0; c < leagueCodes.length; c++) {
    try {
      leagueSettings = await yahooApiService.getLeagueSettings(req, res, leagueCode.leaguecode);
    } catch {
      continue;
    }
  }
};

export default {
  GetSeasonPosition,
  GetSeasonStatModifer,
  ImportSeasonStatModifiers
};
