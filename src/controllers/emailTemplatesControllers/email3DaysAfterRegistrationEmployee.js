const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const path = require('path');
const fs = require('fs');
const emailSubjectJSON = require('../../Nodemailer/Email3DaysAfterRegistration/emailSubject.json');
const sendTestEmail = require('../../Nodemailer/Email3DaysAfterRegistration/sendTestEmailAfter3DaysRegistration');

const getCurrentEmailTemplateSubject = (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET,
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        try {
          const emailSubject = emailSubjectJSON.emailSubjectEmployee
          res.status(200).json({ value: emailSubject })
        } catch(err) {
          res.status(500).json({message: err})
        }
      }
    }
  )
}

const updateEmailSubject = (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET,
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const newEmailSubject = req.body.emailSubject

        try {
          const localJSONpath = path.join(__dirname, '../../Nodemailer/Email3DaysAfterRegistration/emailSubject.json')
          
          Object.assign(emailSubjectJSON, {
            emailSubjectEmployee: newEmailSubject
          })
  
          fs.writeFileSync(localJSONpath, JSON.stringify(emailSubjectJSON))
          
          res.status(200).json({value: emailSubjectJSON.emailSubjectEmployee, message: 'Subiect E-mail actualizat cu success!'})
        } catch(err) {
          res.status(500).json({message: err})
        }
      }
    }
  )
}

const uploadFile = (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET,
    async (err, data) => {
      let sampleFile;
      let uploadPath;

      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({message: 'No file uploaded !'})
        }
      
        sampleFile = req.files.File;
        uploadPath = path.join(__dirname, '../../', 'Nodemailer', 'Email3DaysAfterRegistration/template', sampleFile.name)
      
        // Useing mv() method to place the file anywhere on the server
        sampleFile.mv(uploadPath, function(error) {
          if (error) {
            console.log(error)
            return res.status(500).json({message: error})
          }      
          res.status(200).json({message: 'File successfully uploaded !'});
        })
      }
    }
  )
}

const downloadFile = (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET,
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const file = path.join(__dirname, '../../', 'Nodemailer/Email3DaysAfterRegistration/template', 'email3DaysAfterRegistrationEmployee.handlebars')
        res.download(file)
      }
    }
  )
}

const renderTemplate = (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET,
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const filePath = path.join(__dirname, "../../", "Nodemailer/Email3DaysAfterRegistration/template", "email3DaysAfterRegistrationEmployee.handlebars")

        res.setHeader('Content-Type', 'text/html');
        
        fs.readFile(filePath, 'utf-8', (err, template) => {
          if (err) {
            res.status(500).json({message: "There was an error in reading the template"})
          }
          res.end(template)
        })
      }
    }
  )
}

const sendTestEmailTemplate = async(req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const recipientEmailAddress = req.body.testEmail
        const studentType = req.body.studentType
        try {         
          // call the function that sends the actual TEST E-MAIL TEMPLATE
          const sendEmail = await sendTestEmail(recipientEmailAddress, studentType)
          res.status(201).json({
            message: `Test E-mail Template successfully sent to ${recipientEmailAddress}`,
            emailResponse: sendEmail
          })
        } catch (error) {
          console.log(error)
          res.status(401).json({success: false, message: 'There was a server error when sending a test E-MAIL TEMPLATE', error})
        }
      }
  })
}

module.exports = {
  uploadFile,
  downloadFile,
  renderTemplate,
  sendTestEmailTemplate,
  updateEmailSubject,
  getCurrentEmailTemplateSubject
}