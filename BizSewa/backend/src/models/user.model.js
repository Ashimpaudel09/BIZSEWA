const { pool } = require("../config/db");

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
}

async function createUser({ name, email, password }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return { id: result.insertId };
}

module.exports = {
  findUserByEmail,
  createUser,
};
