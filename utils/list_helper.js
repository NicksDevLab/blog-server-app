const total = require('./for_testing').total

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return total(blogs)
}

const mostLiked = (blogs) => {
    blogs.sort((a, b) => b.likes - a.likes)
    const topBlog = {
        title: blogs[0].title,
        author: blogs[0].author,
        likes: blogs[0].likes
    }
    return topBlog
}

const mostLikedAuthor = (array) => {
    const totalValues = array.reduce((acc, obj) => {
        if (acc[obj.author]) {
          acc[obj.author] += obj.likes
        } else {
          acc[obj.author] = obj.likes
        }
        return acc;
    }, {});
    const highestLikes = Object.keys(totalValues).reduce((likes, author) => {
        return totalValues[author] > totalValues[likes] ? author : likes
    }, Object.keys(totalValues)[0])

    const mostPopular = {
        author: highestLikes,
        likes: totalValues[highestLikes]
    }
    return mostPopular
}

const mostBlogs = (array) => {
    let highestPostCount = 0
    let bestAuthor = ''
    const totalBlogs = array.reduce((acc, obj) => {
        if (acc[obj.author]) {
            acc[obj.author] += 1
        } else {
            acc[obj.author] = 1
        }
        return acc
    }, {})
    Object.keys(totalBlogs).forEach(author => {
        if (totalBlogs[author] > highestPostCount) {
            highestPostCount = totalBlogs[author]
            bestAuthor = author
        }
    })
    const mostPopularAuthor = { 
        author: bestAuthor, 
        blogs: highestPostCount 
    }
    return mostPopularAuthor
}

module.exports = {
    dummy,
    totalLikes,
    mostLiked,
    mostLikedAuthor,
    mostBlogs
}