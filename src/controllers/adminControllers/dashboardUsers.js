const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');

const { Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index } = faunaDB.query

const getDashboardUsers = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        try {
          const dashboardUsersRaw = await faunaClient.query(
            Map(
              Paginate(Documents(Collection(collections.DASHBOARD_USERS))),
              Lambda(user => Get(user))
            )
          )
          let allDashboardUsers = dashboardUsersRaw.data
          allDashboardUsers = allDashboardUsers.map(item => item.data)
          allDashboardUsers = allDashboardUsers.filter(element => !element.creator)
          res.status(200).json(allDashboardUsers)
        } catch (error) {
          res.status(401).json({message: "There was an error in retrieving the Dashboard Users from database", error})
        }
      }
  })
}

const createDashboardUser = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const newUser = req.body
        try {
          await faunaClient.query(Create(Collection(collections.DASHBOARD_USERS), { data: newUser }))
          res.status(201).json({message: 'User successfully created!'})
        } catch (error) {
          res.status(401).json({message: 'There was an error in creating a new user', error})
        }
      }
  })
}

const changeDashbordUserPermission = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const userToModify = req.body
        try {
          const searchedUser = await faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_DASHBOARD_USER_BY_USERNAME), userToModify.username)),
              Lambda(user => Get(user))
            )
          )

          const docID = searchedUser.data[0].ref.id
          await faunaClient.query(
            Update(
              Ref(Collection(collections.DASHBOARD_USERS), docID),
              { data: { access: userToModify.access, pagesPermission: userToModify.pagesPermission } }
            )
          )
          res.status(201).json({message: 'User permissions have been successfully updated!'})
        } catch (error) {
          res.status(401).json({ message: 'There was an error in updating the user permissions', error})
        }
      }
  })
}

const deleteDashboardUser = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {  
        const userToDelete = req.body.username      
        try {
          const searchedUser = await faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_DASHBOARD_USER_BY_USERNAME), userToDelete)),
              Lambda(x => Get(x))
            )
          )

          const docID = searchedUser.data[0].ref.id
          await faunaClient.query(
            Delete(Ref(Collection(collections.DASHBOARD_USERS), docID))
          )
          res.status(200).json({
            message: `Success! User --> ${userToDelete} <-- has been deleted`
          })
        } catch (error) {
          res.status(401).json({ message: 'There was an error in deleting the user', error})
        }
      }
  })
}


module.exports = {
  getDashboardUsers,
  createDashboardUser,
  changeDashbordUserPermission,
  deleteDashboardUser
}