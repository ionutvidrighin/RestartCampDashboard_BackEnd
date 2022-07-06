const express = require("express")
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require("../FaunaDataBase/faunaDB");
const collections = require("../FaunaDataBase/collections");

const {Map, Collection, Paginate, Documents, Get, Lambda} = faunaDB.query

router.route('/restart-camp-courses')
  .get( async (req, res) => {
    try {
      // query all free courses
      const coursesModule1FromDB = await faunaClient.query(
        Map(
          Paginate(Documents(Collection(collections.COURSES_MODULE_1))),
          Lambda(x => Get(x))
        )
      )
      let coursesModule1 = coursesModule1FromDB.data
      coursesModule1 = coursesModule1.map(item => item.data)
      coursesModule1.sort((a, b) => {
        return new Date(b.courseDate) - new Date(a.courseDate)
      })

      // query all paid courses
      const coursesModule2FromDB = await faunaClient.query(
        Map(
          Paginate(Documents(Collection(collections.COURSES_MODULE_2))),
          Lambda(x => Get(x))
        )
      )
      let coursesModule2 = coursesModule2FromDB.data
      coursesModule2 = coursesModule2.map(item => item.data)
      coursesModule2.sort((a, b) => {
        return new Date(b.courseDate) - new Date(a.courseDate)
      })

      res.status(200).json({coursesModule1, coursesModule2})
    } catch (error) {
      res.status(401).json({message: "There was an error in retrieving the Free Courses from database", error})
    }
  })


module.exports = router;