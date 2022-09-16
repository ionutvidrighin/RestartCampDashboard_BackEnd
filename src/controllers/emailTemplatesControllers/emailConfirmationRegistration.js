const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const getAccessKey = require("../../Authentication/getAccessKey");
const sendTestEmail = require('../../Nodemailer/EmailConfirmationRegistrationTEMPLATE/sendTestEmailConfirmationRegistration');

const { Map, Collection, Paginate, Documents, Get, Lambda } = faunaDB.query

const getEmailTemplate = async (req, res) => {
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
}

const updateEmailTemplate = async(req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  const newEmailTemplateObject = req.body
  
  if (accessKey === appAccessKey) {
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
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const sendTestEmailTemplate = async(req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  const newEmailTemplateObject = req.body
  const recipientEmailAddress = newEmailTemplateObject.testEmail
  
  if (accessKey === appAccessKey) {
    try {         
      // call the function that sends the actual TEST E-MAIL TEMPLATE
      const sendEmail = await sendTestEmail(recipientEmailAddress, newEmailTemplateObject)

      res.status(201).json({ 
        message: `Test E-mail Template successfully sent to ${recipientEmailAddress}`,
        emailResponse: sendEmail
      })

    } catch (error) {
      console.log(error)
      res.status(401).json({success: false, message: 'There was a server error when sending a test E-MAIL TEMPLATE', error})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

module.exports = {
  getEmailTemplate,
  updateEmailTemplate,
  sendTestEmailTemplate
}