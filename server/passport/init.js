const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../../db/init')();

module.exports = function(passport) {
  passport.use(new Strategy(
    
    function(username, password, cb) {
        findUserByUsername(username, async function(err, user) {
          if (err) {
            console.log("ERROR:", err);
            return cb(err);
          }
          if (!user) {
            console.log("User not found.")
            return cb(null, false);
          }
          var success;
          try {            
            success = await bcrypt.compare(password, user.password_hash);
          } catch(err) {
            console.log("Password Compare Error: " + err);
            success = false;
          }
          if (!success) {
            return cb(null, false);
          }
          console.log("Successful Login");
          return cb(null, user);
        }
      );
    }
  ));

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    findUserByUserId(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

  function findUserByUsername(username, cb) {
    process.nextTick(async function() {
      // Find User
      const user = db.prepare('SELECT * FROM Users WHERE username = ?').get(username);
      if (user) {
        cb(null, user);
      } else {
        cb(new Error('User ' + username + ' does not exist'));
      }
    });
  }

  function findUserByUserId(userId, cb) {
    process.nextTick(async function() {
      // Find user
      const user = db.prepare('SELECT * FROM Users WHERE id = ?').get(userId);
      if (user) {
        cb(null, user);
      } else {
        cb(new Error('User ' + user.id + ' does not exist'));
      }
    });
  }
  
  return passport
}