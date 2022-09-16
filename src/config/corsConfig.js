
const whiteList = [
  "https://dashboard.restart-camp.org", 
  "http://localhost:3000", 
  "http://localhost:3001"
]

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }
}

module.exports = corsOptions