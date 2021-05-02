//We can do this all in server.js but since this is a big app and we need many routes so we do not want to complicate the server.js

const express = require('express');
const router = express.Router();
//Need the middleware
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//@route        Get api/auth
//@desc         Test route
//@access       Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); //req.user because the Token is encrypted and in middleware we used req.user to fetch the user details
    //String of -passwor '-password' will leave of the password from the fetched information
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}); //auth to make this route protected

//@route        POST api/auth
//@desc         Authenticate & get token
//@access       Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid Email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //To return Error in form of an array
      return res.status(400).json({ errors: errors.array() });
    }
    //Pullout Name Email and Password from requested body
    const { email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password); //Returns a promise, Takes two parameters : a normal entered password and an encrypted password  // Because we have the user details we can fetch the encrypted password
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //Return JsonWebToken
      const payload = {
        user: {
          id: user.id, //user.save() will return us a promise so we can get user.id
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
