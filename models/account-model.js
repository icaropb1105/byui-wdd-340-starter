const pool = require("../database");

/* *****************************
 * Get account information by email
 * Used in login process
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
      FROM account
      WHERE account_email = $1
    `;
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountByEmail:", error);
    return null;
  }
}

/* *****************************
 * Get account information by ID
 * Used to retrieve account details for logged in users
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type
      FROM account
      WHERE account_id = $1
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountById:", error);
    return null;
  }
}

/* *****************************
 * Register a new account
 * Hash password and insert into DB
 * ***************************** */
async function registerAccount(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING account_id, account_firstname
    `;
    const result = await pool.query(sql, [firstname, lastname, email, password]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in registerAccount:", error);
    return null;
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  registerAccount,
};
