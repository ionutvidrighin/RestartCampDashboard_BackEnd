const express = require("express");
const router = express.Router();
let courses = require('./courses')

const authToken = 'password'

/*let newCourseId = 0;
const coursesIds = courses.map(course => course.courseId)
console.log(coursesIds)

while(coursesIds.indexOf(newCourseId) != -1) {
  newCourseId++
}*/

router.route('/free-courses')
  .get((req, res) => {
    const auth_token = req.headers.authorization

    if(auth_token === authToken) {
      res.status(200).json({courses})
    } else {
      res.status(401).json({error: 'Invalid Token'})
    }
  })
  .post((req, res) => {
    const received_course = req.body
    const auth_token = req.headers.authorization

    if(auth_token === authToken) {
      courses.unshift(received_course)

      res.status(201).json({message: 'Curs adaugat cu succes!'})
    } else {
      res.status(401).json({error: 'Invalid Token'})
    }
  })
  .put((req, res) => {
    const courseToModify = req.body
    const auth_token = req.headers.authorization

    if(auth_token === authToken) {
      let index = courses.findIndex(course => course.courseId === courseToModify.courseId)
      courses[index] = courseToModify

      res.status(200).json({
        message: 'Curs modificat cu succes !'
      })
    } else {
      res.status(401).json({ error: 'Invalid Token'})
    }
  })
  .patch((req, res) => {
    const courseToModify = req.body
    const auth_token = req.headers.authorization

    if(auth_token === authToken) {
      let index = courses.findIndex(course => course.courseId === courseToModify.courseId)
      courses[index].courseActive = courseToModify.courseActive

      res.status(201).json({
        message: `Curs ${courseToModify.courseActive ? 'activat' : 'dezactivat'} cu succes !`
      })
    } else {
      res.status(401).json({ error: 'Invalid Token'})
    }
  })
  .delete((req, res) => {
   let courseIdToRemove = req.body.course.courseId
    const auth_token = req.headers.authorization
    
    if(auth_token === authToken) {
      courses = courses.filter(course => course.courseId != courseIdToRemove)
      //console.log(courses)

      res.status(200).json({
        message: 'Curs sters cu succes !'
      })
    } else {
      res.status(401).json({ error: 'Invalid Token'})
    }
  })


module.exports = router;