const pool = require("../database");
const bcrypt = require("bcryptjs");

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


async function updateAccount(account_id, first_name, last_name, email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `;
    const values = [first_name, last_name, email, account_id];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in updateAccount:", error);
    return null;
  }
}

async function updatePassword(account_id, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `;
    const values = [hashedPassword, account_id];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return null;
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  registerAccount,
  updateAccount,
  updatePassword,
};

