const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../.env'});

const generateDatabaseToken = (req, res) => {
  const loggedUser = req.body.username
  const token = jwt.sign(
    { loggedUser },
    process.env.FAUNA_SECRET,
    { expiresIn: '7h' }
  )
  res.json({ token })
}

module.exports = generateDatabaseToken