import pool from '../db.js';
import yahooApiService from './yahooApiService.js';
import viewService from '../viewService.js';
import seasonService from './seasonService.js';
import gamecodeService from './gameCodeService.js';
import seasonRosterPositionService from './rosterPositionService.js';
import positionTypeService from './positionTypeService.js';
import seasonPositionService from './seasonPositionService.js';
import gameCodeTypeService from './gameCodeTypeService.js';

const GetStatCategory = async () => {
  const results = await pool.query(`select ssc.*, gc.gamecodetypeid from seasonstatcategory as ssc 
  join season as s on s.seasonid = ssc.seasonid
  join gamecode as gc on s.gamecodeid = gc.gamecodeid `);
  return results;
};

const GetStatCategorySeasonIdYahooCategoryId = async () => {
  const results = await pool.query(`select s.seasonstatcategoryid, s.seasonid, s2.name, s2.yahoocategoryid from seasonstatcategory s 
  join seasonstatcategorytype s2 on s.seasonstatcategorytypeid = s2.seasonstatcategorytypeid 
  `);
  return results;
};

const GetStatCategoryType = async () => {
  const results = await pool.query('select * from seasonstatcategorytype');
  return results;
};

const ImportStatCategories = async (req, res) => {
  let existingStatCategories = await GetStatCategory();
  let existingStatCategoryTypes = await GetStatCategoryType();
  const existingSeasonPosition = seasonPositionService.GetSeasonPosition();
  const existingGameCodeTypes = await gameCodeTypeService.getAllCodeTypes();
  const existingPositionTypeService = await positionTypeService.GetPositionTypes();
  const leagueCodes = await viewService.GetYahooLeagueCodes();
  const seasons = await seasonService.getExistingSeasons();
  const gamecodes = await gamecodeService.getAllGameCodes();


  for (let c = 0; c < leagueCodes.rows.length; c++) {
    const leagueCode = leagueCodes.rows[c];
    let leagueSettings;
    try {
      leagueSettings = await yahooApiService.getLeagueSettings(req, res, leagueCode.leaguecode);
    } catch (e) {
      continue;
    }
    const splitLeagueCode = leagueCode.leaguecode.split('.');
    const yahoogamecode = splitLeagueCode[0];
    const yahooleagueid = splitLeagueCode[2];
    const gamecodeFilter = gamecodes.rows.filter((value) => value.yahoogamecode === yahoogamecode);
    const gamecode = gamecodeFilter[0];
    const seasonFilter = await seasons.filter((value) => value.gamecodeid === Number(gamecode.gamecodeid) && value.yahooleagueid === Number(yahooleagueid));
    const season = seasonFilter[0];

    const gameCodeTypeFilter = existingGameCodeTypes.rows.filter((value) => value.yahoogamecode === leagueSettings.data.game_code);
    const gameCodeType = gameCodeTypeFilter[0];

    for (let s = 0; s < leagueSettings.data.settings.stat_categories.length; s++) {
      const statCategory = leagueSettings.data.settings.stat_categories[s];

      const positiontypeFilter = existingPositionTypeService.rows.filter((value) => value.yahoopositiontype === statCategory.position_type && value.gamecodetypeid === gameCodeType.gamecodetypeid);
      const positionType = positiontypeFilter[0];

      let statCategoryTypeFilter = existingStatCategoryTypes.rows.filter((value) => value.yahoocategoryid === statCategory.stat_id && value.gamecodetypeid === gameCodeType.gamecodetypeid);

      if (statCategoryTypeFilter.length === 0) {
        const statCategoryTypeInsert = [
          statCategory.stat_id,
          statCategory.name,
          statCategory.display_name,
          gameCodeType.gamecodetypeid,
          positionType.positiontypeid
        ];
        const query = 'INSERT INTO seasonstatcategorytype(yahoocategoryid, name, displayname, gamecodetypeid, positiontypeid) VALUES($1, $2, $3, $4, $5)';
        const results = await pool.query(query, statCategoryTypeInsert);
        existingStatCategoryTypes = await GetStatCategoryType();
        statCategoryTypeFilter = existingStatCategoryTypes.rows.filter((value) => value.yahoocategoryid === statCategory.stat_id && value.gamecodetypeid === gameCodeType.gamecodetypeid);
      }

      const statCategoryType = statCategoryTypeFilter[0];
      const existingSeasonStatCategoryFilter = existingStatCategories.rows.filter((value) => value.seasonid === season.seasonid && value.seasonstatcategorytypeid === statCategoryType.seasonstatcategorytypeid);

      if (existingSeasonStatCategoryFilter.length === 0) {
        const statCategoryInsert = [
          statCategoryType.seasonstatcategorytypeid,
          season.seasonid,
          statCategory.enabled
        ];
        console.log(`Inserting SeasonStatCategory ${statCategoryType.name} for ${season.seasonid}`);
        const query = 'INSERT INTO seasonstatcategory(seasonstatcategorytypeid, seasonid, enabled) VALUES($1, $2, $3)';
        const results = await pool.query(query, statCategoryInsert);
      }
    }
  }
};

export default {
  ImportStatCategories,
  GetStatCategory,
  GetStatCategoryType,
  GetStatCategorySeasonIdYahooCategoryId
};
