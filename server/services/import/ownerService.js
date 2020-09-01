import pool from '../db.js';
import ownerModel from '../../models/import/ownerModel.js';

const getYahooGuidsFromDb = async () => {
  try {
    const results = await pool.query('SELECT distinct yahooguid FROM owner');
    return [...new Set(results.rows.map((item) => item.yahooguid))];
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getOwnersFromDb = async () => {
  try {
    return await pool.query('SELECT * FROM owner');
  } catch (e) {
    console.log(e);
    return e;
  }
};

async function insertOwners(owners) {
  try {
    const query = ownerModel.insert(owners).returning(ownerModel.ownerid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows.length);
  } catch (e) {
    console.error('fail');
  } finally {
    // client.end();
  }
}

const importOwners = async (req, res, owners, leagueid) => {
  const existingOwners = await getYahooGuidsFromDb();
  const ownersToImport = [];
  for (let i = 0; i < owners.length; i++) {
    const currentOwner = owners[i];
    if (existingOwners.length === 0 || !existingOwners.includes(currentOwner.guid)) {
      ownersToImport.push({
        leagueid,
        yahooguid: currentOwner.guid,
        ownername: currentOwner.nickname,
        email: currentOwner.email,
        yahoomanagerid: currentOwner.manager_id
      });
    }
  }

  if (ownersToImport.length > 0) {
    await insertOwners(ownersToImport);
  }
};

export default { getYahooGuidsFromDb, importOwners, getOwnersFromDb };
