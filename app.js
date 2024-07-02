const usersRouter = require('./controllers/usersRouter')
const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogsRouter')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/loginRouter')
const logger = require('./utils/logger')

app.use(cors())
app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogRouter)
app.use(middleware.errorHandler)

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.info('Error connecting to MongoDB: ', error.message)
  })

module.exports = app