const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = async function(password) {
  try {
    const pwHash = await bcrypt.hash(password, saltRounds)
    return pwHash;
  } catch(err) {
    console.log(err);
    return 'error';
  }
}