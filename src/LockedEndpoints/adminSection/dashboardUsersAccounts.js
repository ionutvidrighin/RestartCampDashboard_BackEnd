/**
File handling all USERS of the application 
*/

/*** ENDPOINTS:
1. GET - fetches all users created for the application
  (/get-dashboard-users)

2. POST - creates a new user; stores it to "coursesModule1" collection
  (/create-dashboard-user)

3. PUT - changes the user permissions
  (/change-user-permission)

5. DELETE - delete a specific user
  (/delete-dashboard-user)
*/

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');
const getAccessKey = require("../../Authentication/getAccessKey");

const { Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index } = faunaDB.query

router.route('/get-dashboard-users')
  .get( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)

    if (accessKey === appAccessKey) {
      try {
        const dashboardUsersRaw = await faunaClient.query(
          Map(
            Paginate(Documents(Collection(collections.DASHBOARD_USERS))),
            Lambda(user => Get(user))
          )
        )
        let allDashboardUsers = dashboardUsersRaw.data
        allDashboardUsers = allDashboardUsers.map(item => item.data)
        res.status(200).json(allDashboardUsers)
      } catch (error) {
        res.status(401).json({message: "There was an error in retrieving the Dashboard Users from database"})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

router.route('/create-dashboard-user')
  .post( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    if (accessKey === appAccessKey) {
      const newUser = req.body
      try {
        await faunaClient.query(Create(Collection(collections.DASHBOARD_USERS), { data: newUser }))
        res.status(201).json({message: 'User successfully created!'})
      } catch (error) {
        res.status(401).json({message: 'There was an error in creating a new user', error})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
})

router.route('/change-user-permission')
  .put( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    const userToModify = req.body
    const searchUserByEmail = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_DASHBOARD_USER_BY_EMAIL), userToModify.username)),
        Lambda(user => Get(user))
      )
    )

    if (searchUserByEmail.data.length === 0) {
      res.status(404).json({ message: 'User could not be found in data base'})
      return
    }

    if (accessKey === appAccessKey) {
      try {
        const docID = searchUserByEmail.data[0].ref.id
        await faunaClient.query(
          Update(
            Ref(Collection(collections.DASHBOARD_USERS), docID),
            { data: { permissions: userToModify.permissions } }
          )
        )
        res.status(201).json({message: 'User permissions have been successfully updated!'})
      } catch (error) {
        res.status(401).json({ message: 'There was an error in updating the user permissions', error})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

router.route('/delete-dashboard-user')
  .delete( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    const userToDelete = req.body.element.username
    const searchUserByEmail = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_DASHBOARD_USER_BY_EMAIL), userToDelete)),
        Lambda(x => Get(x))
      )
    )

    if (searchUserByEmail.data.length === 0) {
      res.status(404).json({ message: 'User could not be found in data base'})
      return
    }

    if (accessKey === appAccessKey) {
      try {
        const docID = searchUserByEmail.data[0].ref.id
        await faunaClient.query(
          Delete(Ref(Collection(collections.DASHBOARD_USERS), docID))
        )
        res.status(200).json({
          message: `Success! User --> ${userToDelete} <-- has been deleted`
        })
      } catch (error) {
        res.status(401).json({ message: 'There was an error in deleting the user', error})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
})

module.exports = router