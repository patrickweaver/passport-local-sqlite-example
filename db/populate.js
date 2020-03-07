// Create Users table and add an admin user to DB if
// table does not already exist

const admin_username = process.env.DEFAULT_ADMIN_USERNAME
const admin_password = process.env.DEFAULT_ADMIN_PASSWORD

module.exports = async function() {
  
  const db = require('./init')();
  
  const success = db.prepare(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      permissions TEXT NOT NULL
    )
  `).run();
  if (success) {
    console.log("New table Users created or exists!");
  } else {
    console.log("Error creating or accessing Users table.")
  }
  
  let users = db.prepare(`
    SELECT * FROM Users
  `).all();
  
  if (users.length === 0 && admin_username && admin_password) {
    const hashPassword = require('../server/passport/hashPassword');
    const admin_password_hash = await hashPassword(admin_password)
    db.prepare(`
      INSERT INTO Users (username, password_hash, permissions)
      VALUES
        (?, ?, ?)
    `).run(admin_username, admin_password_hash, 'admin');
  }
  
  users = db.prepare(`
    SELECT * FROM Users
  `).all();
  
  console.log("Users:")
  console.log(users);
  
}