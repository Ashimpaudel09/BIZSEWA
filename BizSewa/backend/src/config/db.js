const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDB() {
  const connection = await pool.getConnection();

  try {
    // USERS
   await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

    // BUSINESSES
    await connection.query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        business_name VARCHAR(150) NOT NULL,
        registration_no VARCHAR(100) UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // APPLICATIONS
    await connection.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        business_id INT NOT NULL,
        applicant_user_id INT NOT NULL,
        type VARCHAR(100) NOT NULL,
        status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
        officer_id INT DEFAULT NULL,
        officer_remarks TEXT DEFAULT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        decided_at DATETIME DEFAULT NULL,

        FOREIGN KEY (business_id) REFERENCES businesses(id),
        FOREIGN KEY (applicant_user_id) REFERENCES users(id),
        FOREIGN KEY (officer_id) REFERENCES users(id)
      )
    `);

    console.log("✅ All tables ready");
  } finally {
    connection.release();
  }
}

module.exports = { pool, initDB };
