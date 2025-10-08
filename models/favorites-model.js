const pool = require("../database/");

async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rows[0];
}

async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM favorites
    WHERE account_id = $1 AND inv_id = $2;
  `;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rowCount;
}

async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT i.*
    FROM inventory AS i
    JOIN favorites AS f ON i.inv_id = f.inv_id
    WHERE f.account_id = $1
    ORDER BY i.inv_make, i.inv_model;
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}

async function isFavorite(account_id, inv_id) {
  const sql = `
    SELECT * FROM favorites
    WHERE account_id = $1 AND inv_id = $2;
  `;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rowCount > 0;
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccount,
  isFavorite,
};
