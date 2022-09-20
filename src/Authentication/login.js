/**
File handling LOGIN to the App
*/

const express = require('express');
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require('../FaunaDataBase/faunaDB');
const indexes = require('../FaunaDataBase/indexes');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../.env'});
const verifyLoginToken = require('../middleware/verifyLoginToken');

const { Match, Map, Paginate, Get, Lambda, Index, Var} = faunaDB.query;

router.post('/generate-token', async (req, res) => {
  const loginUsername = req.body.username
  const loginUserPassword = req.body.password
  
  try {
    const searchedUser = await faunaClient.query(
      Map(Paginate(Match(Index(indexes.GET_DASHBOARD_USER_BY_USERNAME), loginUsername)),
        Lambda('user', Get(Var('user')))
      )
    )

    if (searchedUser.data.length === 0) {
      res.status(404).json({ message: 'Credentiale login invalide.' })
      return
    }

    const dbUsername = searchedUser.data[0].data.username
    const dbUserPassword = searchedUser.data[0].data.password

    if (dbUsername === loginUsername && dbUserPassword === loginUserPassword) {
      const token = jwt.sign(
        { loginUsername },
        process.env.AUTH_SECRET_KEY,
        { expiresIn: '3m' }
      )
      res.json({ token })
    } else {
      res.status(404).json({ message: 'Credentiale login invalide' })
    }
  } catch (error) {
    console.log(error)
    res.status(401).json({
      message: "Database Error - Please contact developer",
      error
    })
  }
})

router.get('/login', verifyLoginToken, (req, res) => {
  jwt.verify(
    req.token, 
    process.env.AUTH_SECRET_KEY, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.sendStatus(403)
      } else {
        const userName = data.loginUsername
        try {
          const searchedUser = await faunaClient.query(
            Map(Paginate(Match(Index(indexes.GET_DASHBOARD_USER_BY_USERNAME), userName)),
              Lambda('user', Get(Var('user')))
            )
          )
          const successfullyLoggedUser = searchedUser.data[0].data
          delete successfullyLoggedUser['password']
          res.status(200).json({loggedUser: successfullyLoggedUser})
        } catch (error) {
          res.status(401).json({
            message: "Database Error - Please contact developer",
            error
          })
        }
      }
  })
})


module.exports = router;