const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");
const allUsersRegistered = require('../LockedEndpoints/coursesRegistration/usersRegistered_JSON');

router.route('/register-student')
  .post( (req, res) => {
    const user = req.body
    res.status(200).json(user)
    /*res.status(200).json({ message: 'adaugat cu success' })
    let newID = 0
    let existingIDs = []
    allUsersRegistered.forEach(entry => existingIDs.push(entry.id))

    while (existingIDs.indexOf(newID) != -1) {
      newID++
    }

    const newUser = new RestartCampUser(user)
    Object.assign(newUser, {id: newID})
    
    allUsersRegistered.push(newUser)
    res.status(200).json({ message: 'adaugat cu success' })*/
  })

module.exports = router