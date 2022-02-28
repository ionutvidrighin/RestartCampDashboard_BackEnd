/**
File handling the change of E-mail confirmation after registration TEMPLATE 
*/

/*** ENDPOINTS:
1. GET - fetches the entire E-MAIL TEMPLATE stored to data base => "emailConfirmationAfterRegistration" collection
2. POST - creates new Object containing whole E-MAIL TEMPLATE; stores it to "emailConfirmationAfterRegistration" collection
*/


const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../faunaDB");
const getAccessKey = require("../../Authentication/getAccessKey")
const sendTestConfirmationEmail = require('../../Nodemailer/ConfirmationEmailTemplate/sendTestConfirmationEmailAfterRegistration')

const { Map, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref } = faunaDB.query

router.route('/email-confirmation-after-registration')
  .get( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)

    if (accessKey === appAccessKey) {
      try {
        const emailTemplateObjectFromDB = await faunaClient.query(
          Map(
            Paginate(Documents(Collection('emailConfirmationAfterRegistration'))),
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

      // if block dealing with sending a test email template  
      if (newEmailTemplateObject.hasOwnProperty('testEmail')) {
        try {         
          // call the function that sends the actual TEST E-MAIL TEMPLATE
          const sendEmail = await sendTestConfirmationEmail(newEmailTemplateObject)

          res.status(201).json({
            success: true,
            message: 'TESTING E-MAIL TEMPLATE content successfully sent',
            emailResponse: sendEmail
          })

        } catch (error) {
          console.log(error)
          res.status(401).json({success: false, message: 'There was an error in sending a test E-MAIL TEMPLATE', error})
        }
      } else {
        const emailTemplateObject = await faunaClient.query(
          Map(Paginate(Documents(Collection('emailConfirmationAfterRegistration'))),
            Lambda(x => Get(x))
          )
        )

        try {
          const docID = emailTemplateObject.data[0].ref.id
          await faunaClient.query(
            Update(
              Ref(Collection('emailConfirmationAfterRegistration'), docID),
              { data: newEmailTemplateObject }
            )
          )
          res.status(201).json({
            success: true,
            message: 'E-MAIL TEMPLATE content successfully added',
            data: newEmailTemplateObject
          })
        } catch (error) {
          res.status(401).json({success: false, message: 'There was a server or database error when adding the E-MAIL TEMPLATE content', error})
        }
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

module.exports = router;