require('dotenv').config({path: '../.env'})

const faunaDB = require("faunadb")
const faunaClient = new faunaDB.Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN,
  scheme: process.env.FAUNA_SCHEME,
})

module.exports = faunaClient