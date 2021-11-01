require('dotenv').config({path: '.env'})
const app = require('./src/app')

const port = process.env.PORT || 4545

app.listen(port, () => {
  console.log(`Server up on: http://localhost:${port}`)
})