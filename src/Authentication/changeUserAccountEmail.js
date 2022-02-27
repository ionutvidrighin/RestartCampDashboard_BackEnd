/**
File handling the change of User account email
*/

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");
const getAccessKey = require("../Authentication/getAccessKey");

const { Ref, Match, Map, Paginate, Get, Update, Collection, Lambda, Index, Var } = faunaDB.query

router.route("/change-email")
.put(async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)

  const userAccountEmail = req.body.currentUserAccountEmail
  const newUserAccountEmail = req.body.newUserAccountEmail

  const checkUserInDB = await faunaClient.query(
    Map(
      Paginate(Match(Index("login_email"), userAccountEmail)),
      Lambda("user", Get(Var("user")))
    )
  )

  if (checkUserInDB.data.length === 0) {
    res.status(404).json({ message: `Account with e-mail address ${userAccountEmail} could not be found`})
    return
  }

  if (accessKey === appAccessKey) {
    try {
      const docID = checkUserInDB.data[0].ref.value.id
      await faunaClient.query(
        Update(
          Ref(Collection('dashboardUsersAccount'), docID), 
          { data: { email: newUserAccountEmail } }
        )
      )
      res.status(201).json({
        message: "User Account Email Updated Successfully !",
        newEmail: newUserAccountEmail
      })
    } catch (error) {
      res.status(401).json({
        message: "There was an error when trying to update user account password",
      })
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
})

module.exports = router;
