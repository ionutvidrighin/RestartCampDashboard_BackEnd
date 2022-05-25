/**
File handling the change of User account email
*/

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("./FaunaDataBase/faunaDB");

const { Ref, Match, Map, Paginate, Get, Update, Collection, Lambda, Index, Var, Documents } = faunaDB.query

router.route('/test')
  .get( async (req, res) => {
    try {
      // query all free courses
      const dataFromDB = await faunaClient.query(
        Map(
          Paginate(Documents(Collection('test'))),
          Lambda(x => Get(x))
        )
      )
      let dataToReturn = []
      const data = dataFromDB.data
      data.forEach(element => dataToReturn.push(element.data))
      console.log(data)
      console.log(dataToReturn)

      res.status(200).json({dataFromDB})
    } catch (error) {
      console.log(error)
      res.status(401).json({message: "There was an error in retrieving the Free Courses from database", error})
    }
  })

module.exports = router;
