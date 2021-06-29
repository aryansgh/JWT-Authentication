const express = require('express');
const Blog = require('../models/blogs');

const router = express.Router(); //mini app

router.get('/blogs/create', (req,res) => {
    res.render('create', {title: 'Create a Blog'});
})

//blog routes:
router.get('/blogs', (req,res) => {
    Blog.find().sort({createdAt:-1})
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result}) //sending back data to the user.
            console.log(result);
        })
        .catch((err) => {
            res.send(err);
        })
})

//post requests:
router.post('/blogs', (req,res) => {
    console.log(req.body);
    const blog = new Blog(req.body);

    blog.save() 
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        })
})



//route parameter from index.ejs where every blog title is a link
router.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log('error is here')
        console.log(err);
      });
  });


router.post('/blogs/:id', (req,res) => {
    const id = req.params.id;
    //console.log(id);
    console.log('I am here man')
    //console.log(res.body);
    const blog = new Blog(req.body);

    blog.save() 
    .then((result) => {
        console.log('content updated');
        Blog.findByIdAndDelete(id)
        .then(result => {
            console.log('Blog deleted')
            res.redirect('/blogs')
            //res.json({ redirect: '/blogs' });
        })
        .catch(err => {
            console.log(err);
        });
        //res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    })     
})

router.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });

router.get('/blogs/update/:id', (req,res) => {
    const id = req.params.id;
    //console.log(id);
    res.render('update', {title: 'Update Blog', updateid: id});
})

module.exports = router;