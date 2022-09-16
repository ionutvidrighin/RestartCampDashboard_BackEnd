const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');

const {Map, Collection, Paginate, Documents, Get, Lambda} = faunaDB.query

const getAllCourses = async (req, res) => {
  try {
    // get COURSES MODULE 1
    const coursesMod1 = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.COURSES_MODULE_1))),
        Lambda(x => Get(x))
      )
    )
    let coursesModule1 = coursesMod1.data
    coursesModule1 = coursesModule1.map(item => item.data)
    coursesModule1.sort((a, b) => {
      return new Date(b.courseDate) - new Date(a.courseDate)
    })

    // get COURSES MODULE 2
    const coursesMod2 = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.COURSES_MODULE_2))),
        Lambda(x => Get(x))
      )
    )
    let coursesModule2 = coursesMod2.data
    coursesModule2 = coursesModule2.map(item => item.data)
    coursesModule2.sort((a, b) => {
      return new Date(b.courseDate) - new Date(a.courseDate)
    })

    res.status(200).json({coursesModule1, coursesModule2})
  } catch (error) {
    console.log(error)
    res.status(401).json({message: "There was an error in retrieving the Free Courses from database", error})
  }
}

module.exports = getAllCourses