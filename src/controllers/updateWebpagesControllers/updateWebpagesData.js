const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');

const { Update, Ref, Map, Collection, Paginate, Documents, Get, Lambda } = faunaDB.query

const updateCoursesPageData = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const newCoursesPageData = req.body
        if (Object.keys(newCoursesPageData).length !== 0) {
          try {      
            const dataBaseLocationToUpdate = await faunaClient.query(
              Map(
                Paginate(Documents(Collection(collections.COURSES_WEBPAGE_DATA))),
                Lambda(data => Get(data))
              )
            )
  
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
        } else {
          res.status(401).json({ message: 'Nicio modificare detectata'})
        }
      }
  })
}

const updateCoursesPresencePageData = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const newCoursePresencePageData = req.body
        try {      
          const dataBaseLocationToUpdate = await faunaClient.query(
            Map(
              Paginate(Documents(Collection(collections.COURSE_PRESENCE_WEBPAGE_DATA))),
              Lambda(data => Get(data))
            )
          )
      
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
      }
  })
}

const updateHeaderFooterData = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const newHeaderFooterData = req.body
        try {      
          const dataBaseLocationToUpdate = await faunaClient.query(
            Map(
              Paginate(Documents(Collection(collections.HEADER_FOOTER_WEBPAGE_DATA))),
              Lambda(data => Get(data))
            )
          )
      
          const docID = dataBaseLocationToUpdate.data[0].ref.id
          await faunaClient.query(
            Update(
              Ref(Collection(collections.HEADER_FOOTER_WEBPAGE_DATA), docID),
              { data: newHeaderFooterData }
            )
          )
          res.status(201).json({message: 'Header & Footer Data has been successfully updated!', newHeaderFooterData})
        } catch (error) {
          console.log(error)
          res.status(401).json({ message: 'Error in updating the Header & Footer Data', error})
        }
      }
  })
}

const updateRegistrationFormAlerts = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const newRegistrationFormAlerts = req.body
        try {      
          const dataBaseLocationToUpdate = await faunaClient.query(
            Map(
              Paginate(Documents(Collection(collections.REGISTRATION_FORM_ALERTS))),
              Lambda(data => Get(data))
            )
          )
      
          const docID = dataBaseLocationToUpdate.data[0].ref.id
          await faunaClient.query(
            Update(
              Ref(Collection(collections.REGISTRATION_FORM_ALERTS), docID),
              { data: {alerts: newRegistrationFormAlerts} }
            )
          )
          res.status(201).json({message: 'Registration Form Alerts have been successfully updated!', newRegistrationFormAlerts})
        } catch (error) {
          console.log(error)
          res.status(401).json({ message: 'There was an error in updating the Registration Form Alerts', error})
        }
      }
  })
}

module.exports = {
  updateCoursesPageData,
  updateCoursesPresencePageData,
  updateHeaderFooterData,
  updateRegistrationFormAlerts
}
