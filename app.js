const usersRouter = require('./controllers/usersRouter')
const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogsRouter')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogRouter)
app.use(middleware.errorHandler)

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.error('Error connecting to MongoDB: ', error.message)
  })

module.exports = app