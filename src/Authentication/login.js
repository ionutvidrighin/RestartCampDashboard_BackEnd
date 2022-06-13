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
    const loginUsername = req.body.username
    const loginUserPassword = req.body.password
    const appAccessKey = req.body.accessKey
    
    try {
      const validateUsername = await faunaClient.query(
        Map(Paginate(Match(Index("get_user_by_username"), loginUsername)),
          Lambda('user', Get(Var('user')))
        )
      )
      const validateAccessKey = await faunaClient.query(
        Map(
          Paginate(Match(Index("get_app_access_key"), appAccessKey)),
          Lambda("key", Get(Var("key")))
        )
      )

      if (validateUsername.data.length === 0) {
        res.status(401).json({
          message: 'Invalid Login. Please check your credentials'
        })
        return
      }
      if (validateAccessKey.data.length === 0) {
        res.status(401).json({
          message: 'Invalid Access Key. Please retry'
        })
        return
      }

      const dbUsername = validateUsername.data[0].data.username
      const dbUserPassword = validateUsername.data[0].data.password

  
      if (dbUsername === loginUsername && dbUserPassword === loginUserPassword) {
        const successfullyLoggedUser = validateUsername.data[0].data
        res.status(200).json({
          message: 'LoggedIn Successfully !',
          loggedUser: successfullyLoggedUser
        })
      } else {
        res.status(401).send({
          message: 'Invalid Login. Please check your credentials'
        })
      }
    } catch (error) {
      res.status(401).send({
        message: error
      })
    }
  })

module.exports = router;