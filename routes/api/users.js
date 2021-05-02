//We can do this all in server.js but since this is a big app and we need many routes so we do not want to complicate the server.js

const express = require('express');
const router = express.Router();
//Express Validator
const { check, validationResult } = require('express-validator');
const user = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const config = require('config');

//@route        POST api/users
//@desc         Register User
//@access       Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid Email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //To return Error in form of an array
      return res.status(400).json({ errors: errors.array() });
    }
    //Pullout Name Email and Password from requested body
    const { name, email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //Get user Gravatar
      const avatar = gravatar.url(email, {
        //Passing three extra methods
        s: '200', //Size 200
        r: 'pg', //Rating PG so we donot have any naked avatar
        d: 'mm', //To set a default Image
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //Encrypt Password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
