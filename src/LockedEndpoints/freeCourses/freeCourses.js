/**
File handling the FREE COURSES in database 
*/

/*** ENDPOINTS:
1. GET - fetches all free courses stored to data base => "freeCourses" collection
2. POST - creates a new free course; stored it to "freeCourses" collection
3. PUT - modifies various entries in the free course object
4. PATCH - makes the free course ACTIVE / INACTIVE
5. DELETE - removes the free course from the data base
*/

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../faunaDB");
const getAccessKey = require("../../Authentication/getAccessKey")

const { Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index } = faunaDB.query

router.route('/free-courses')
  .get( async(req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)

    if (accessKey === appAccessKey) {
      try {
        const coursesFromDB = await faunaClient.query(
          Map(
            Paginate(Documents(Collection('freeCourses'))),
            Lambda(x => Get(x))
          )
        )
        let freeCourses = coursesFromDB.data
        freeCourses = freeCourses.map(item => item.data)
        freeCourses.sort((a, b) => {
          return new Date(b.courseDate) - new Date(a.courseDate)
        })
        res.status(200).json(freeCourses)
      } catch (error) {
        res.status(401).json({message: "There was an error in retrieving the Free Courses from database"})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

  .post( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    if (accessKey === appAccessKey) {
      const newCourse = req.body
      try {
        await faunaClient.query(
          Create(
            Collection('freeCourses'),
            { data: newCourse }
          )
        )
        res.status(201).json({message: 'Curs adaugat cu succes!'})
      } catch (error) {
        res.status(401).json({message: 'There was an error in adding a new course', error})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

  .put( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    const courseToModify = req.body
    const searchCourseByID = await faunaClient.query(
      Map(
        Paginate(Match(Index('get_free_course_by_id'), courseToModify.courseId)),
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
            Ref(Collection('freeCourses'), docID),
            { data: courseToModify }
          )
        )
        res.status(201).json({message: 'Course has been successfully modified !'})
      } catch (error) {
        res.status(401).json({ message: 'There was an error in modifying the course', error})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

  .patch( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)

    const courseToModify = req.body
    const searchCourseByID = await faunaClient.query(
      Map(
        Paginate(Match(Index('get_free_course_by_id'), courseToModify.courseId)),
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
          Update(Ref(Collection("freeCourses"), docID),
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
  })

  .delete( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    const courseIdToRemove = req.body.course.courseId
    const searchCourseByID = await faunaClient.query(
      Map(
        Paginate(Match(Index('get_free_course_by_id'), courseIdToRemove)),
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
          Delete(Ref(Collection('freeCourses'), docID))
        )
        res.status(200).json({
          message: 'Success! Course has been deleted'
        })
      } catch (error) {
        res.status(401).json({ message: 'There was an error in deleting the course', error})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })


module.exports = router;