
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  snippet: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true
  },
}, { timestamps: true });


// it pluralizes this 'Blog' and searches for that collection in the database therefore if it is blog then it will search for blogs in the atlas mongoDB
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;