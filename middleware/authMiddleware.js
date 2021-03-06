const jwt = require('jsonwebtoken');
const User = require('../models/user')

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt //.jwt is the cookie name

    //check if there is a token exists and is verfified
    if(token) {
        jwt.verify(token, 'aryan singh secret', (err, decodedToken)=> {
            if(err) {
                console.log(err);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

//check the current user

const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, 'aryan singh secret', async (err, decodedToken)=> {
            if(err) {
                console.log(err);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else  {
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkUser};