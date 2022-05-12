/**
File handling the update of the "7 days reminder E-mail"  
*/

/*** ENDPOINTS:
1. GET - fetches the entire E-MAIL TEMPLATE stored to data base => "emailReminder7Days" collection
2. POST - creates new Object containing whole E-MAIL TEMPLATE; stores it to "emailReminder7Days" collection
*/

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const cron = require('node-cron');
const collections = require('../../FaunaDataBase/collections');
const getAccessKey = require("../../Authentication/getAccessKey");
const sendTestReminderEmail1Day = require('../../Nodemailer/EmailReminder1DayTEMPLATE/sendTest_EmailReminder1Day');
const testingCronFnArg = require('../../Nodemailer/testingCron')

const { Map, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref } = faunaDB.query

// cron.schedule('*/2 * * * *', async () => {
//   const send = await sendTestReminderEmail1Day(testingCronFnArg)
//   console.log(send)
// });

router.route('/email-reminder-1day')
  .get( async (req, res) => {
    const userAccessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(userAccessKey)

    if (userAccessKey === appAccessKey) {
      try {
        const emailTemplateObjectFromDB = await faunaClient.query(
          Map(
            Paginate(Documents(Collection(collections.EMAIL_REMINDER_1DAY))),
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
    const userAccessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(userAccessKey)
    
    if (userAccessKey === appAccessKey) {
      const newEmailTemplateObject = req.body

      // this check deals with sending a test email template  
      if (newEmailTemplateObject.hasOwnProperty('testEmail')) {
        try {         
          // call the function that sends the actual TEST E-MAIL TEMPLATE
          const sendEmail = await sendTestReminderEmail1Day(newEmailTemplateObject)
          console.log(sendEmail)

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
          Map(Paginate(Documents(Collection(collections.EMAIL_REMINDER_1DAY))),
            Lambda(x => Get(x))
          )
        )

        try {
          const docID = emailTemplateObject.data[0].ref.id
          await faunaClient.query(
            Update(
              Ref(Collection(collections.EMAIL_REMINDER_1DAY), docID),
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