/**
File handling the change of User account password
*/

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");

const { Ref, Match, Map, Paginate, Get, Update, Collection, Lambda, Index, Var } = faunaDB.query

router.route("/change-password")
.put( async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)

  const userAccountEmail = req.body.email
  const userAccountCurrentPassword = req.body.currentPassword
  const newUserAccountPassword = req.body.newPassword

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
    const docID = checkUserInDB.data[0].ref.value.id
    const currentStoredPassword = checkUserInDB.data[0].data.password

    if (currentStoredPassword !== userAccountCurrentPassword) {
      res.status(401).json({message: "Parola curenta este gresita"})
      return
    }

    try {
      await faunaClient.query(
        Update(
          Ref(Collection('dashboardUsersAccount'), docID), 
          { data: { password: newUserAccountPassword } }
        )
      )
      res.status(201).json({
        response: "User Account Password Updated Successfully !",
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
