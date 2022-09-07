const express = require("express")
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require("../../FaunaDataBase/collections");

const {Update, Ref, Map, Collection, Paginate, Documents, Get, Lambda} = faunaDB.query

router.route('/courses-page-data')
  .get( async (req, res) => {
    try {
      const databaseResponse = await faunaClient.query(
        Map(
          Paginate(Documents(Collection(collections.COURSES_WEBPAGE_DATA))),
          Lambda(data => Get(data))
        )
      )
      const coursesPageData = databaseResponse.data[0].data
      res.status(200).json(coursesPageData)
    } catch(error) {
      console.log(error)
      res.status(401).json({message: "Error in retrieving the Courses Webpage Data from database", error})
    }
  })

  .put( async (req, res) => {
    const newCoursesPageData = req.body
    const dataBaseLocationToUpdate = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.COURSES_WEBPAGE_DATA))),
        Lambda(data => Get(data))
      )
    )

    try {      
      const docID = dataBaseLocationToUpdate.data[0].ref.id
      await faunaClient.query(
        Update(
          Ref(Collection(collections.COURSES_WEBPAGE_DATA), docID),
          { data: newCoursesPageData }
        )
      )
      res.status(201).json({message: 'Courses Webpage Data has been successfully updated!', newCoursesPageData})
    } catch (error) {
      console.log(error)
      res.status(401).json({ message: 'Error in updating the Courses Webpage Data', error})
    }
  })

module.exports = router