const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');

const { Map, Collection, Paginate, Documents, Get, Lambda } = faunaDB.query

const getCoursesPageData = async (req, res) => {
  try {
    const databaseResponse = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.COURSES_WEBPAGE_DATA))),
        Lambda(data => Get(data))
      )
    )
    const coursesPageData = databaseResponse.data[0].data
    res.status(200).json(coursesPageData)
  } catch(error) {
    console.log(error)
    res.status(401).json({message: "Error in retrieving the Courses Webpage Data from database", error})
  }
}

const getCoursesPresencePageData = async (req, res) => {
  /** this function is used in 2 endpoints (GET and POST)
   * POST endpoint will always have a body of form { scenario: [String] }
   * based on the String value inside the Array, we take out the needed part and send it to FrontEnd
   **/
  const requestHasBody = Object.keys(req.body).length !== 0

  try {
    const databaseResponse = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.COURSE_PRESENCE_WEBPAGE_DATA))),
        Lambda(data => Get(data))
      )
    )
    let responseBody = databaseResponse.data
    
    let coursePresencePageData = {}
    if (requestHasBody) {
      const requestDataScenario = req.body.scenario
      responseBody.forEach(dataSet => {
        requestDataScenario.forEach(scenario => {
          if (dataSet.data.hasOwnProperty(scenario)) {
            Object.assign(coursePresencePageData, {
              [scenario]: {
                collectionId: dataSet.ref.id,
                pageData: dataSet.data[scenario]
              }
            })
          }
        })
      })
      responseBody = coursePresencePageData
    } else {
      responseBody = responseBody.map(dataSet => dataSet.data)
    }
    res.status(200).json(coursePresencePageData)
  } catch(error) {
    console.log(error)
    res.status(401).json({message: "There was an error in retrieving the Course Presence Page Data from database", error})
  }
}

const getHeaderFooterData = async (req, res) => {
  try {
    const databaseResponse = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.HEADER_FOOTER_WEBPAGE_DATA))),
        Lambda(data => Get(data))
      )
    )
    const headerFooterData = databaseResponse.data[0].data
    res.status(200).json(headerFooterData)
  } catch(error) {
    console.log(error)
    res.status(401).json({message: "Error in retrieving the Header & Footer Data from database", error})
  }

}

const getRegistrationFormAlerts = async (req, res) => {
  try {
    const databaseResponse = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.REGISTRATION_FORM_ALERTS))),
        Lambda(data => Get(data))
      )
    )
    const registrationFormAlerts = databaseResponse.data[0].data
    res.status(200).json(registrationFormAlerts)
  } catch(error) {
    console.log(error)
    res.status(401).json({message: "Error in retrieving the Registration Form Alerts from database", error})
  }

}

module.exports = {
  getCoursesPageData,
  getCoursesPresencePageData,
  getHeaderFooterData,
  getRegistrationFormAlerts
}