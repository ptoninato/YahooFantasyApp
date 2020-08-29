import pool from '../db.js';
import transactionTypeModel from '../../models/import/transacitonTypeModel.js';

const GetTransactionTypes = async () => {
  try {
    const results = await pool.query('select * from transactiontype');
    return results;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const InsertTransactionType = async (req, res, type) => {
  try {
    const query = transactionTypeModel.insert(type).returning(transactionTypeModel.transactiontypeid).toQuery();
    const { rows } = await pool.query(query);
    console.log(rows.length);
    return rows;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default { GetTransactionTypes, InsertTransactionType };
