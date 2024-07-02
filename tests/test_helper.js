const Blog = require('../models/blog')
const User = require('../models/user')


// const initialUsers = [
//   { 
//     username: 'root', 
//     name: 'Superuser', 
//     passwordHash, 
//     blogs: [] 
//   },

// ]

const initialBlogs = [
  {
    title: "String1",
    author: "author1",
    url: "url1",
    likes: 1,
    user: null
  },
  {
    title: "String2",
    author: "author2",
    url: "url2",
    likes: 2,
    user: null
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}