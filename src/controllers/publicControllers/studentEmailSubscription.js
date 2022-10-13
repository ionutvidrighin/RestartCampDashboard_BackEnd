const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const collections = require('../../FaunaDataBase/collections');

const { Collection, Get, Paginate, Map, Match, Lambda, Update, Ref, Index } = faunaDB.query

const subscribeStudentToEmails = async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail
    const studentOccurences = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENT_IN_COURSES_MODULE1_BY_EMAIL), studentEmail)),
        Lambda(student => Get(student))
      )
    )

    if (studentOccurences.data.length === 0) {
      res.status(404).json({message: `Cursantul ${studentEmail}, nu există în baza de date.`})
      return
    }

    studentOccurences.data.forEach(async (entry) => {
      const docID = entry.ref.id
      await faunaClient.query(
        Update(
          Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), docID),
          { data: { subscribedToEmails: true } }
        )
      )
    })

    res.status(200).json({message: `Cursantul ${studentEmail}, a fost abonat cu succes la newsletter.`})

  } catch(error) {
    console.log(error)
    res.status(422).json({message: `Eroare. Cursantul ${studentEmail} nu a putut fi abonat la newsletter.`})
  }
}

const unsubscribeStudentFromEmails = async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail
    const studentOccurences = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENT_IN_COURSES_MODULE1_BY_EMAIL), studentEmail)),
        Lambda(student => Get(student))
      )
    )

    if (studentOccurences.data.length === 0) {
      res.status(404).json({message: `Cursantul ${studentEmail}, nu există în baza de date.`})
      return
    }

    studentOccurences.data.forEach(async (entry) => {
      const docID = entry.ref.id
      await faunaClient.query(
        Update(
          Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), docID),
          { data: { subscribedToEmails: false } }
        )
      )
    })

    res.status(200).json({message: `Cursantul ${studentEmail}, a fost dezabonat cu succes de la newsletter.`})

  } catch(error) {
    console.log(error)
    res.status(422).json({message: `Eroare. Cursantul ${studentEmail} nu a putut fi dezabonat de la newsletter.`})
  }
}

module.exports = {
  subscribeStudentToEmails,
  unsubscribeStudentFromEmails
}