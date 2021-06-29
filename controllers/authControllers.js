const User = require('../models/user')
const jwt = require('jsonwebtoken')


//handle errors

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: ''};


    //incorrect email
    if(err.message === 'incorrect email') {
        errors.email = 'that email is not registered';
    }

    //incorrect passowrd
    if(err.message == 'incorrect password') {
        errors.password = 'password is incorrect'
    }
 

    console.log(err);
    //duplicate error code
    if(err.code===11000) {
        errors.email='That email has already registered.'
        return errors;
    }

    //validation errors
    if(err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors;
}

const maxAge = 3*24*60*60;

const createToken = (id) => {
    return jwt.sign({ id }, 'aryan singh secret', {  //here aryan singh secret is the secret for the JWT.
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req,res) => {
    const temp_object = {};
    res.render('signup',{error: temp_object});
}

module.exports.signup_post = async (req,res) => {
    const {email, password} = req.body; 

    const temp_object = {};

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user : user._id});
        //res.render('signup' ,{error : temp_object});
        
    }
    catch(err) {

        const errors = handleErrors(err);
        //console.log(err);
        res.status(400).json({errors}); //sending the errors back
        //res.render('signup', {error: errors});
        
    }

    // console.log(email,password);
    // res.send('new signup');
    // console.log(req.body); //the json parser middleware attaches the post data in the request body
}

module.exports.login_get = (req,res) => {
    res.render('login');
}

module.exports.login_post = async (req,res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({user: user._id});
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }


    // console.log(email,password);
    // res.send('user login');
    // console.log(req.body); //the json parser middleware attaches the post data in the request body
}

module.exports.logout_get = (req,res) => {
    //delete the jwt cookie
    //replace with a blank cookie with a very small expiration time
    res.cookie('jwt', '',{maxAge: 1}); //giving the cookie a blank value and a 1 ms expiration time
    res.redirect('/');
}