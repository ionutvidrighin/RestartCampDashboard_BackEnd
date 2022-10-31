const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');

const { Update, Replace, Ref, Map, Collection, Paginate, Documents, Get, Lambda } = faunaDB.query

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
        /* there are 4 possible scenarios when updating data for "Confirm Presence at Course WebPage"
        * 1. scenario I - page is accessed by user on the same day with course day
        *                 it will have a request.body of form -> { "courseDateIsInPresent": { data here... } }
        * 2. scenario II - page is accessed by user when course already took place
        *                  it will have a request.body of form { "courseDateIsInPast": { data here... } }
        * 3. scenario III - page is accessed by user when course will take place on future date
        *                   it will have a request.body of form { "courseDateIsInFuture": { data here... } }
        * 4. scenario IV - page is revealed to user after he confirms his identity. It contains info about
        *                  accessing Zoom to enter at course
        *                  request.body will be of form { "courseZoomAccessPage": { data here.... } }
        */
        const requestBody = req.body
        const requestBodyKeys = Object.keys(req.body)
        const scenario = requestBodyKeys.find(element => element !== 'collectionId')
        const docID = req.body[scenario].collectionId
        const newData = requestBody[scenario]
        const updatedDataResponse = {}

        try {
          delete newData.collectionId
          await faunaClient.query(
            Replace(
              Ref(Collection(collections.COURSE_PRESENCE_WEBPAGE_DATA), docID),
              { data: { [scenario]: newData[scenario] } }
            )
          )

          let updatedDBdata = await faunaClient.query(
            Map(
              Paginate(Documents(Collection(collections.COURSE_PRESENCE_WEBPAGE_DATA))),
              Lambda(data => Get(data))
            )
          )
          updatedDBdata = updatedDBdata.data.forEach(dataSet => {
            const dataSetKeyName = Object.keys(dataSet.data)
            Object.assign(updatedDataResponse, {
              [dataSetKeyName]: {
                pageData: dataSet.data[dataSetKeyName],
                collectionId: dataSet.ref.id
              }
            })
          })

          res.status(201).json({message: 'Course Presence Webpage Data has been successfully updated!', updatedData: updatedDataResponse})
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
