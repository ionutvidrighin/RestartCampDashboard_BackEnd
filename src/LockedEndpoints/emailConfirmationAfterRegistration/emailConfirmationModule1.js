/**
File handling the change of E-mail confirmation after registration TEMPLATE 
*/

/*** ENDPOINTS:
1. GET - fetches the entire E-MAIL TEMPLATE stored to data base => "emailConfirmationRegistration" collection
2. POST - creates new Object containing whole E-MAIL TEMPLATE; stores it to "emailConfirmationRegistration" collection
*/


const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const getAccessKey = require("../../Authentication/getAccessKey")
const sendTestEmailTemplate = require('../../Nodemailer/EmailConfirmationRegistrationTEMPLATE/sendTestEmailConfirmationRegistration')

const { Map, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref } = faunaDB.query

router.route('/email-confirmation-registration')
  .get( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)

    if (accessKey === appAccessKey) {
      try {
        const emailTemplateObjectFromDB = await faunaClient.query(
          Map(
            Paginate(Documents(Collection(collections.EMAIL_CONFIRMATION_REGISTRATION))),
            Lambda(x => Get(x))
          )
        )
        res.status(200).json(emailTemplateObjectFromDB.data[0].data)
      } catch (error) {
        res.status(401).json({message: "There was an error in retrieving the E-mail template content from database"})
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

  .post( async(req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    if (accessKey === appAccessKey) {
      const newEmailTemplateObject = req.body

      // section dealing with sending a test email template  
      if (newEmailTemplateObject.hasOwnProperty('testEmail')) {
        const recipientEmailAddress = newEmailTemplateObject.testEmail
        try {         
          // call the function that sends the actual TEST E-MAIL TEMPLATE
          const sendEmail = await sendTestEmailTemplate(newEmailTemplateObject, recipientEmailAddress)
          //console.log(sendEmail)

          res.status(201).json({
            message: `Test E-mail Template successfully sent to ${recipientEmailAddress}`,
            emailResponse: sendEmail
          })

        } catch (error) {
          console.log(error)
          res.status(401).json({success: false, message: 'There was a server error when sending a test E-MAIL TEMPLATE', error})
        }
      } else {
        // store the updated version of the E-mail Template to DB
        const emailTemplateObject = await faunaClient.query(
          Map(Paginate(Documents(Collection(collections.EMAIL_CONFIRMATION_REGISTRATION))),
            Lambda(x => Get(x))
          )
        )

        try {
          const docID = emailTemplateObject.data[0].ref.id
          await faunaClient.query(
            Update(
              Ref(Collection(collections.EMAIL_CONFIRMATION_REGISTRATION), docID),
              { data: newEmailTemplateObject }
            )
          )
          res.status(201).json({
            success: true,
            message: 'E-MAIL Template content successfully updated',
            data: newEmailTemplateObject
          })
        } catch (error) {
          res.status(401).json({message: 'There was a server or database error when updating the E-mai Template content', error})
        }
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

module.exports = router;