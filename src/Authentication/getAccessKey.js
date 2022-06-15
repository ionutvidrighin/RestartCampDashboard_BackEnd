const faunaDB = require("faunadb");
const faunaClient = require("../FaunaDataBase/faunaDB");

const { Map, Paginate, Match, Get, Lambda, Index, Var } = faunaDB.query

const getAccessKey = async (appAccessKey) => {
  try {
    const accessKey = await faunaClient.query(
      Map(
        Paginate(Match(Index("get_app_access_key"), appAccessKey)),
        Lambda("key", Get(Var("key")))
      )
    )
    return accessKey.data[0].data.accessKey
  } catch (error) {
    return error
  }
}

module.exports = getAccessKey