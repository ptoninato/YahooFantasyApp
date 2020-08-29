import pool from '../db.js';
import yahooApiService from './yahooApiService.js';
import viewService from '../viewService.js';
import statCategoryService from './statCategoryService.js';

const GetSeasonStatModifer = async () => {
  const results = await pool.query('select * from seasonstatmodifier');
  return results;
};

const ImportSeasonStatModifiers = async (req, res) => {
  const existingModifiers = await GetSeasonStatModifer();
  const leagueCodes = await viewService.GetSeasonidLeagueidYahoogamecode();
  const statCategoryTypes = await statCategoryService.GetStatCategoryType();
  const statSeasonCategories = await statCategoryService.GetStatCategory();

  for (let c = 0; c < leagueCodes.rows.length; c++) {
    const league = leagueCodes.rows[c];
    let leagueSettings;
    const leagueCode = `${league.yahoogamecode}.l.${league.yahooleagueid}`;
    try {
      leagueSettings = await yahooApiService.getLeagueSettings(req, res, leagueCode);
    } catch (e) {
      console.log(e);
      continue;
    }
    if (typeof leagueSettings.data.settings.stat_modifiers === 'undefined') {
      continue;
    }
    console.log('here');

    for (let m = 0; m < leagueSettings.data.settings.stat_modifiers.stats.length; m++) {
      const stat = leagueSettings.data.settings.stat_modifiers.stats[m];
      const statCategoryType = statCategoryTypes.rows.filter((value) => value.yahoocategoryid === stat.stat.stat_id && value.gamecodetypeid === league.gamecodetypeid)[0];
      const statCategory = statSeasonCategories.rows.filter((value) => value.seasonid === league.seasonid && value.seasonstatcategorytypeid === statCategoryType.seasonstatcategorytypeid && value.gamecodetypeid === league.gamecodetypeid)[0];

      const existingStatModifier = existingModifiers.rows.filter((value) => value.seasonstatcategoryid === statCategory.seasonstatcategoryid);
      if (existingStatModifier.length === 0) {
        const modifier = [
          statCategory.seasonstatcategoryid,
          stat.stat.value
        ];
        console.log(`Adding Modifier ${statCategoryType.name} with value ${stat.stat.value}`);
        const query = 'INSERT INTO seasonstatmodifier(seasonstatcategoryid, value) VALUES($1, $2)';
        const results = await pool.query(query, modifier);
        console.log('---------------');
      }
    }
  }
};

export default {
  GetSeasonStatModifer,
  ImportSeasonStatModifiers
};
