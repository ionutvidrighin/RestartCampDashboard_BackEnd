const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const getAccessKey = require("../../Authentication/getAccessKey");

const { Map, Collection, Paginate, Documents, Get, Lambda, Update, Ref } = faunaDB.query

const getCurrentAppAccessKey = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)

  if (accessKey === appAccessKey) {
    
    let accessKeyChars = []
    for (let i = 0; i < appAccessKey.length; i++) {
      accessKeyChars = [...accessKeyChars, i]
    }

    res.status(200).json({key: appAccessKey, keyChars: accessKeyChars})
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const updateAppAccessKey = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  const newAppAccessKey = req.body.newKey

  if (accessKey === appAccessKey) {
    const existingAppAccessKey = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.APP_ACCESS_KEY))),
        Lambda(key => Get(key))
      )
    )

    try {
      const docID = existingAppAccessKey.data[0].ref.id
      await faunaClient.query(
        Update(
          Ref(Collection(collections.APP_ACCESS_KEY), docID),
          { data: { accessKey: newAppAccessKey } }
        )
      )

      res.status(201).json({message: 'Application Access Key has been successfully updated!'})
    } catch (error) {
      res.status(401).json({ message: 'There was an error in updating the Application Access Key', error})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

module.exports = {
  getCurrentAppAccessKey,
  updateAppAccessKey
}