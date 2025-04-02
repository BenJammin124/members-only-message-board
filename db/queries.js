const pool = require("./pool");

//create account
async function createAccount(first_name, last_name, email, hashedPassword) {
  await pool.query(
    "INSERT INTO users (first_name, last_name,email, hash) VALUES ($1, $2, $3, $4)",
    [first_name, last_name, email, hashedPassword]
  );

  return true;
}

async function checkForEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return rows;
}

module.exports = {
  createAccount,
  checkForEmail,
};
