const express = require("express")
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require("../FaunaDataBase/faunaDB");
const collections = require("../FaunaDataBase/collections");

const {Update, Ref, Map, Collection, Paginate, Documents, Get, Lambda} = faunaDB.query

router.route('/course-presence-page-data')
  .get( async (req, res) => {
    try {
      const databaseResponse = await faunaClient.query(
        Map(
          Paginate(Documents(Collection(collections.COURSE_PRESENCE_WEBPAGE_DATA))),
          Lambda(data => Get(data))
        )
      )
      const coursePresencePageData = databaseResponse.data[0].data
      res.status(200).json({coursePresencePageData})
    } catch(error) {
      console.log(error)
      res.status(401).json({message: "There was an error in retrieving the Course Presence Page Data from database", error})
    }
  })

  .put( async (req, res) => {
    const newCoursePresencePageData = req.body
    const dataBaseLocationToUpdate = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.COURSE_PRESENCE_WEBPAGE_DATA))),
        Lambda(data => Get(data))
      )
    )

    try {      
      const docID = dataBaseLocationToUpdate.data[0].ref.id
      await faunaClient.query(
        Update(
          Ref(Collection(collections.COURSE_PRESENCE_WEBPAGE_DATA), docID),
          { data: newCoursePresencePageData }
        )
      )
      res.status(201).json({message: 'Course Presence Webpage Data has been successfully updated!', newCoursePresencePageData})
    } catch (error) {
      console.log(error)
      res.status(401).json({ message: 'There was an error in updating the Course Presence Webpage Data', error})
    }
  })

module.exports = router