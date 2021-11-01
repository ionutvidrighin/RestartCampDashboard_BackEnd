/**
File handling the LOGIN route
*/

const express = require('express')
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require('../faunaDB')

const { Match, Map, Paginate, Get, Create, Collection, Lambda, Index, Var} = faunaDB.query;

router.route('/login')
  .post( async (req, res) => {
    const userEmail = req.body.email
    const userPassw = req.body.password
    
    const validateLoginEmail = await faunaClient.query(
      Map(Paginate(Match(Index("login_email"), userEmail)),
        Lambda('user', Get(Var('user')))
      )
    )

    const validateLoginPassword = await faunaClient.query(
      Map(Paginate(Match(Index("login_passw"), userPassw)),
        Lambda('user', Get(Var('user')))
      )
    )

    console.log(validateLoginEmail.data[0].data)
    console.log(validateLoginPassword)

    if(validateLoginEmail.data.length === 0 || validateLoginPassword.data.length === 0) {
      res.status(401).json({
        error: 'Invalid Login. Please check your credentials'
      })
      return
    }

    if ((userEmail === validateLoginEmail.data[0].data.email) && 
        (userPassw === validateLoginPassword.data[0].data.password)) {
      res.status(200).json({
        response: 'LoggedIn Successfully !',
        user: `Welcome ${userEmail.split('@')[0]}`
      })
    } else {
      res.status(401).json({
        error: 'Invalid Login. Please check your credentials'
      })
    }
  })

module.exports = router;