const express = require("express")
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require("../../FaunaDataBase/collections");

const { Update, Ref, Map, Collection, Paginate, Documents, Get, Lambda } = faunaDB.query

router.route('/registration-form-alerts')
  .get( async (req, res) => {
    try {
      const databaseResponse = await faunaClient.query(
        Map(
          Paginate(Documents(Collection(collections.REGISTRATION_FORM_ALERTS))),
          Lambda(data => Get(data))
        )
      )
      const registrationFormAlerts = databaseResponse.data[0].data
      res.status(200).json({registrationFormAlerts})
    } catch(error) {
      console.log(error)
      res.status(401).json({message: "There was an error in retrieving the Registration Form Alerts from database", error})
    }

  })

  .put( async (req, res) => {
    const newRegistrationFormAlerts = req.body
    const dataBaseLocationToUpdate = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.REGISTRATION_FORM_ALERTS))),
        Lambda(data => Get(data))
      )
    )

    try {      
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
  })

module.exports = router