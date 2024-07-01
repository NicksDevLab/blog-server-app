const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

describe('Testing api for blogs', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  describe('when there is initially some notes saved.', () => {

    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const contents = response.body.map(r => r.title)
      assert(contents.includes('String2'))
    })

    describe('viewing a specific blog', () => {

      test('with a specific id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(resultBlog.body, blogToView)
      })
    })
  })

  describe('addition of a new blog.', () => {

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: "new blog",
        author: "my Name",
        url: "newUrl",
        likes: 4,
        userId: "6681ffb941ac7a4cc2652b45"
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const contents = response.body.map(r => r.title)

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert(contents.includes('new blog'))
    })

    test('blog without title is not added', async () => {
      const newBlog = {
        author: "bad Name",
        url: "badUrl",
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updates to blogs', () => {
    test('update blog by id', async () => {
      const blogsBefore = await helper.blogsInDb()
      const blogToUpdate = {
        title: blogsBefore[0].title,
        author: blogsBefore[0].author,
        url: blogsBefore[0].url,
        likes: blogsBefore[0].likes + 1,
        id: blogsBefore[0].id
      }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

      const blogsAfter = await helper.blogsInDb()

      const updatedBlog = blogsAfter.filter(blog => blog.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog[0].likes, blogsBefore[0].likes + 1)
    })
  })

  describe('deletion of a blog.', () => {
    test('deleted by valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const contents = blogsAtEnd.map(r => r.title)
      assert(!contents.includes(blogToDelete.content))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
})

describe('Testing api for users', () => {

  describe('when ther is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', name: 'Superuser', passwordHash, blogs: [] })

      await user.save()
    })

    test('creation succeeds with a new username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
        blogs: []
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})