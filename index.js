const express = require('express')
const app = express()
app.get('/users', (req, res) => {
  res.send({name:'devDuo',age:19})
})
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})