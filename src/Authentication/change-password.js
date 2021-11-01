/**
File handling the LOGIN route
*/

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");

const { Ref, Match, Map, Paginate, Get, Create, Replace, Update, Collection, Lambda, Index, Var } = faunaDB.query

router.route("/change-password")
.put(async (req, res) => {
  const userEmail = req.body.email
  const newUserPassword = req.body.newPassword

  const validateLoginEmail = await faunaClient.query(
    Map(
      Paginate(Match(Index("login_email"), userEmail)),
      Lambda("user", Get(Var("user")))
    )
  )

  if(validateLoginEmail.data.length !== 0) {
    const docID = validateLoginEmail.data[0].ref.value.id

    await faunaClient.query(
      Update(
        Ref(Collection('login'), docID), 
        { 
          data: { 
            password: newUserPassword 
          } 
        }
      )
    ).then(result => console.log(result.data))

    res.status(200).json({
      response: "Password Changed",
    })
  } else {
    res.status(401).json({
      error: "Error",
    })
  }
})

module.exports = router;
