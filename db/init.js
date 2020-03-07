const env = process.env.ENV

let verbose = false;
if (env === 'DEV') {
  verbose = console.log
}

module.exports = function() {
  // Create or init DB:
  const Database = require('better-sqlite3');
  const dbFilePath = process.env.DB_FILE_PATH;
  const db = new Database(dbFilePath, { verbose: verbose });
  return db;
}