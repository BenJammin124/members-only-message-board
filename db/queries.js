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

async function postNewMessage(title, message, user_id) {
  await pool.query(
    "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)",
    [title, message, user_id]
  );

  return true;
}

async function getAllMessages() {
  const { rows } = await pool.query(
    "SELECT messages.id, title, text, user_id, created_at, first_name, last_name, email, member, admin FROM messages JOIN users ON user_id = users.id ORDER BY messages.id DESC"
  );
  return rows;
}

async function addMembershipToUser(id) {
  await pool.query("UPDATE users SET member = true WHERE id = $1", [id]);

  return true;
}

module.exports = {
  createAccount,
  checkForEmail,
  postNewMessage,
  getAllMessages,
  addMembershipToUser,
};
