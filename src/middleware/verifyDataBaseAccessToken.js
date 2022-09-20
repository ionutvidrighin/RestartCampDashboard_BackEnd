const verifyDatabaseAccessToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization']

  if (!authorizationHeader) return res.sendStatus(403)
  
  if (typeof authorizationHeader !== undefined) {
    const token = authorizationHeader.split(' ')[1]
    req.token = token
    next()
  } else {
    res.sendStatus(403)
  }
}

module.exports = verifyDatabaseAccessToken