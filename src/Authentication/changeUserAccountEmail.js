/**
File handling the change of User account email
*/

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");

const { Ref, Match, Map, Paginate, Get, Update, Collection, Lambda, Index, Var } = faunaDB.query

router.route("/change-email")
.put(async (req, res) => {
  const userAccountEmail = req.body.currentUserAccountEmail
  const newUserAccountEmail = req.body.newUserAccountEmail

  const checkUserInDB = await faunaClient.query(
    Map(
      Paginate(Match(Index("login_email"), userAccountEmail)),
      Lambda("user", Get(Var("user")))
    )
  )

  if(checkUserInDB.data.length !== 0) {
    const docID = checkUserInDB.data[0].ref.value.id

    await faunaClient.query(
      Update(
        Ref(Collection('login'), docID), 
        { 
          data: { 
            email: newUserAccountEmail
          } 
        }
      )
    ).then(result => console.log(result.data))

    res.status(200).json({
      response: "User Account Email Updated Successfully !",
    })
  } else {
    res.status(401).json({
      error: "Error",
    })
  }
})

module.exports = router;
