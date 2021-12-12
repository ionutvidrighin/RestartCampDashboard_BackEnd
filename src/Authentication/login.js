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

    const requestUserEmail = req.body.userEmail
    const requestUserPassw = req.body.userPassword
    
    const validateLogin = await faunaClient.query(
      Map(Paginate(Match(Index("login_email"), requestUserEmail)),
        Lambda('user', Get(Var('user')))
      )
    )
    console.log(req.body)

    if (validateLogin.data.length === 0) {
      res.status(401).json({
        message: 'Invalid Login. Please check your credentials'
      })
    } else {
      const dbUserEmail = validateLogin.data[0].data.email
      const dbUserPassw = validateLogin.data[0].data.password

      if (dbUserEmail === requestUserEmail && dbUserPassw === requestUserPassw) {
        res.status(200).json({
          message: 'LoggedIn Successfully !',
          user: `${dbUserEmail.split('@')[0]}`
        })
      } else {
        res.status(401).send({
          message: 'Invalid Login. Please check your credentials'
        })
      }
    }

    /*if(validateLoginEmail.data.length === 0 || validateLoginPassword.data.length === 0) {
      res.status(401).json({
        error: 'Invalid Login. Please check your credentials'
      })
      return
    }

    if ((userEmail === validateLoginEmail.data[0].data.email) && 
        (userPassw === validateLoginPassword.data[0].data.password)) {
      res.status(200).json({
        message: 'LoggedIn Successfully !',
        user: `${userEmail.split('@')[0]}`
      })
    } else {
      res.status(401).json({
        error: 'Invalid Login. Please check your credentials'
      })
    }*/
  })

module.exports = router;