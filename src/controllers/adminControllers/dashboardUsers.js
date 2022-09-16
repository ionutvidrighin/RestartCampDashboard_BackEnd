const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');
const getAccessKey = require("../../Authentication/getAccessKey");

const { Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index } = faunaDB.query

const getDashboardUsers = async (req, res) => {
  console.log('get dashboard users TRIGGGERRRED')
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
      allDashboardUsers = allDashboardUsers.filter(element => !element.creator)
      res.status(200).json(allDashboardUsers)
    } catch (error) {
      res.status(401).json({message: "There was an error in retrieving the Dashboard Users from database", error})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const createDashboardUser = async (req, res) => {
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
}

const changeDashbordUserPermission = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  const userToModify = req.body

  if (accessKey === appAccessKey) {
    const searchedUser = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_DASHBOARD_USER_BY_USERNAME), userToModify.username)),
        Lambda(user => Get(user))
      )
    )
  
    if (searchedUser.data.length === 0) {
      res.status(404).json({ message: 'User could not be found in data base'})
      return
    }

    try {
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
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const deleteDashboardUser = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  const userToDelete = req.body.username

  if (accessKey === appAccessKey) {
    const searchedUser = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_DASHBOARD_USER_BY_USERNAME), userToDelete)),
        Lambda(x => Get(x))
      )
    )
  
    if (searchedUser.data.length === 0) {
      res.status(404).json({ message: 'User could not be found in data base'})
      return
    }

    try {
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
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}


module.exports = {
  getDashboardUsers,
  createDashboardUser,
  changeDashbordUserPermission,
  deleteDashboardUser
}