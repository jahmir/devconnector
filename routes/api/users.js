const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const User = require('../../models/User');

const Users = require('../../models/User')

// @route POST api/users
// @desc Register User
// @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        //see if user exists
        if(user){
            return res.status(400).json({ errors: [{msg: 'User already exists'}]})
        }

        //Get users gravatar
        const avatar = gravatar.url({
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        //Encrypt password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        //save user to db
        await user.save()

        //Return jsonwebtoken
        res.send('User registered')
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
})

module.exports = router;