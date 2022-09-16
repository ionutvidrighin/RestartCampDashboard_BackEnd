const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');
const getAccessKey = require("../../Authentication/getAccessKey");

const { Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index } = faunaDB.query


const getCourses = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)

  if (accessKey === appAccessKey) {
    try {
      const coursesFromDB = await faunaClient.query(
        Map(
          Paginate(Documents(Collection(collections.COURSES_MODULE_2))),
          Lambda(x => Get(x))
        )
      )
      let paidCourses = coursesFromDB.data
      paidCourses = paidCourses.map(item => item.data)
      paidCourses.sort((a, b) => {
        return new Date(b.courseDate) - new Date(a.courseDate)
      })
      res.status(200).json(paidCourses)
    } catch (error) {
      res.status(401).json({message: "There was an error in retrieving the Paid Courses from database"})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const addNewCourse = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  
  if (accessKey === appAccessKey) {
    try {
      const newCourse = req.body
      await faunaClient.query(
        Create(
          Collection(collections.COURSES_MODULE_2),
          { data: newCourse }
        )
      )
      res.status(201).json({message: 'Curs adaugat cu succes!'})
    } catch (error) {
      res.status(401).json({message: 'Invalid Token', error})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const updateCourse = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  
  const courseToModify = req.body
  const searchCourseByID = await faunaClient.query(
    Map(
      Paginate(Match(Index(indexes.GET_COURSE_MODULE2_BY_ID), courseToModify.courseId)),
      Lambda(x => Get(x))
    )
  )

  if (searchCourseByID.data.length === 0) {
    res.status(404).json({ message: 'Course could not be found in data base'})
    return
  }

  if (accessKey === appAccessKey) {
    try {
      const docID = searchCourseByID.data[0].ref.id
      await faunaClient.query(
        Update(
          Ref(Collection(collections.COURSES_MODULE_2), docID),
          { data: courseToModify }
        )
      )
      res.status(200).json({message: 'Course has been successfully modified !'})
    } catch (error) {
      res.status(401).json({ message: 'There was an error in modifying the course', error})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const updateCourseState = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  
  const courseToModify = req.body
  const searchCourseByID = await faunaClient.query(
    Map(
      Paginate(Match(Index(indexes.GET_COURSE_MODULE2_BY_ID), courseToModify.courseId)),
      Lambda(x => Get(x))
    )
  )

  if (searchCourseByID.data.length === 0) {
    res.status(404).json({ message: 'Course could not be found in data base'})
    return
  }

  if (accessKey === appAccessKey) {
    try {
      const docID = searchCourseByID.data[0].ref.id;
      await faunaClient.query(
        Update(Ref(Collection(collections.COURSES_MODULE_2), docID),
          { data: { courseActive: courseToModify.courseActive } }
        )
      )
      res.status(201).json({
        message: `Course ${courseToModify.courseActive ? "activated" : "deactivated"} with success !`})
    } catch (error) {
      res.status(401).json({message: "There was an error in updating the course state", error})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const deleteCourse = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  
  const courseIdToRemove = req.body.courseId
  const searchCourseByID = await faunaClient.query(
    Map(
      Paginate(Match(Index(indexes.GET_COURSE_MODULE2_BY_ID), courseIdToRemove)),
      Lambda(x => Get(x))
    )
  )

  if (searchCourseByID.data.length === 0) {
    res.status(404).json({ message: 'Course could not be found in data base'})
    return
  }

  if (accessKey === appAccessKey) {
    try {
      const docID = searchCourseByID.data[0].ref.id
      await faunaClient.query(
        Delete(Ref(Collection(collections.COURSES_MODULE_2), docID))
      )
      res.status(200).json({
        message: 'Success! Paid Course has been deleted'
      })
    } catch (error) {
      res.status(401).json({ message: 'There was an error in deleting the paid course', error})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}


module.exports = {
  getCourses,
  addNewCourse,
  updateCourse,
  updateCourseState,
  deleteCourse
}