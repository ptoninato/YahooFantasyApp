import pool from './db.js';
import positionTypeModel from '../models/positionTypeModel.js';

async function GetPositionTypes() {
  try {
    const results = await pool.query('SELECT * FROM positiontype');
    return results;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function InsertPositionType(positiontype) {
  try {
    const query = positionTypeModel.insert(positiontype).returning(positionTypeModel.positiontypeid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows);
  } catch (e) {
    console.error(e);
  } finally {
    // client.end();
  }
}

export default { GetPositionTypes, InsertPositionType };
