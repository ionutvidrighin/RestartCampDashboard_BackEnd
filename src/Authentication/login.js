/**
File handling LOGIN to the App
*/

const express = require('express')
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require('../FaunaDataBase/faunaDB')

const { Match, Map, Paginate, Get, Lambda, Index, Var} = faunaDB.query;

router.route('/login')
  .post( async (req, res) => {
    const loginUserEmail = req.body.email
    const loginUserPassw = req.body.password
    const appAccessKey = req.body.accessKey
    
    const validateLogin = await faunaClient.query(
      Map(Paginate(Match(Index("login_email"), loginUserEmail)),
        Lambda('user', Get(Var('user')))
      )
    )
    const validateAccessKey = await faunaClient.query(
      Map(
        Paginate(Match(Index("get_access_key"), appAccessKey)),
        Lambda("key", Get(Var("key")))
      )
    )
    
    if (validateLogin.data.length === 0 || validateAccessKey.data.length === 0) {
      res.status(401).json({
        message: 'Invalid Access Key. Please retry'
      })
      return
    }

    const dbUserEmail = validateLogin.data[0].data.email
    const dbUserPassw = validateLogin.data[0].data.password

    if (dbUserEmail === loginUserEmail && dbUserPassw === loginUserPassw) {
      res.status(200).json({
        message: 'LoggedIn Successfully !',
        user: `${dbUserEmail.split('@')[0]}`
      })
    } else {
      res.status(401).send({
        message: 'Invalid Login. Please check your credentials'
      })
    }
  })

module.exports = router;