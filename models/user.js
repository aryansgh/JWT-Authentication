const mongoose = require('mongoose');
const {isEmail} = require('validator');
const {isStrongPassword} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: [true, 'This email has alredy been taken, Please choose another email'],
        lowercase: true,
        validate: [isEmail,'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
        validate: [isStrongPassword,'the password is not strong enough']
        //{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    },
},{ timestamps: true });

//mongoose hook
//fire a function before a doc is saved:
//hash the passwords in the function below
userSchema.pre('save', async function (next) {
    //hashing the password
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    //console.log('user about to be created');
    next();
})


//fire a function after an event takes place in the mongoose database:
userSchema.post('save', function(doc, next) {
    console.log('New user was created and saved', doc);
    next();
})

//static method to login user
userSchema.statics.login = async function(email,password) {
    const user = await this.findOne({email: email});

    if(user) {
        const auth = await bcrypt.compare(password,user.password) //compare hashed password
        if(auth) {
            return user; //login user
        }
        throw Error('incorrect password');
    }

    throw Error('incorrect email');

}

const User = mongoose.model('User', userSchema);
module.exports = User;