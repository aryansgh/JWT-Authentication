const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const Blog = require('./models/blogs');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

//const blogRoutes = require('./routes/blogRoutes');
//creating an express app
const app = express();

//json parser middlerware
app.use(express.json());

//connect to mongoDB
const dbURI = 'mongodb+srv://aryans:test1234@cluster0.52xbp.mongodb.net/NodeBlog?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
        .then((result) => console.log('connected to db'))
        .catch(err => console.log(err));

//register view engine
app.set('view engine', 'ejs');

//listen for request:
app.listen(3000);


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))  //middleware to accept form data. //create.ejs is sending a post request and we have to catch it
app.use(morgan('dev'));
app.use(cookieParser());

//app.get('*', checkUser);

app.get('/', requireAuth,(req,res) => {
    //res.send('<p>This is the home page</p>');
    //relative path
    //res.sendFile('./views/index.html', {root: __dirname });
    res.redirect('/blogs');
})

app.get('/about', requireAuth,(req,res) => {
    //res.sendFile('./views/about.html', {root: __dirname });
    //res.send('about page');
    res.render('about',{title: 'About'})
})

//redirect:
app.get('about-us',(req, res)=> {
    res.redirect('/about');
})

app.get('/blogs/create', (req,res) => {
    res.render('create', {title: 'Create a Blog'});
})

//blog routes:
app.get('/blogs', (req,res) => {
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
app.post('/blogs', (req,res) => { 
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
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        res.render('404', {title: 'Blog not found'})
        console.log('error is here')
        console.log(err);
      });
  });


app.post('/blogs/:id', (req,res) => {
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

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });

app.get('/blogs/update/:id', (req,res) => {
    const id = req.params.id;
    //console.log(id);
    res.render('update', {title: 'Update Blog', updateid: id});
})


//middleware
//app.use(blogRoutes);

//middleware for authroutes
app.use(authRoutes);

// app.get('/set-cookies', (req,res) => {
//    //res.setHeader('Set-Cookie', 'newUser=true');

//     res.cookie('newuser', false) 
//     res.cookie('cookietest2', false, {maxAge: 1000*60*60*24, httpOnly: true});
//     res.send('You got the cookies');
// })

// app.get('/read-cookies', (req,res) => {
//     const cookies = req.cookies;
//     console.log(cookies);
//     res.json(cookies);
// })


//404 page:
//if there has not been a match then this file will fire up
//This is like a fail safe
app.use((req,res) => {
    //console.log(res);
    //res.status(404).sendFile('./views/404.html', {root: __dirname });
    res.status(404).render('404', {title: '404'});
})