const express = require("express")
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require("../FaunaDataBase/faunaDB");
const collections = require("../FaunaDataBase/collections");

const {Update, Ref, Map, Collection, Paginate, Documents, Get, Lambda} = faunaDB.query

router.route('/header-footer-data')
  .get( async (req, res) => {
    try {
      const databaseResponse = await faunaClient.query(
        Map(
          Paginate(Documents(Collection(collections.HEADER_FOOTER_WEBPAGE_DATA))),
          Lambda(data => Get(data))
        )
      )
      const headerFooterData = databaseResponse.data[0].data
      res.status(200).json({headerFooterData})
    } catch(error) {
      console.log(error)
      res.status(401).json({message: "There was an error in retrieving the Header & Footer Data from database", error})
    }

  })

  .put( async (req, res) => {
    const newHeaderFooterData = req.body
    const dataBaseLocationToUpdate = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.HEADER_FOOTER_WEBPAGE_DATA))),
        Lambda(data => Get(data))
      )
    )

    try {      
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
      res.status(401).json({ message: 'There was an error in updating the Header & Footer Data', error})
    }
  })

module.exports = router