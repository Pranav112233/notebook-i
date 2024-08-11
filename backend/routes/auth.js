const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Harryisagoodb$oy';

// ROUTE 1: Create a User us ing : POST "/api/auth/"createuser . Doesnt require Auth

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
  let success=false;
  //If there are errors, return Bad request and the errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  //  Check whether the user with this email exists already

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return req.status(400).json({success, error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email
    })
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    // console.log(jwtData);
    success=true;
    res.json({success, authtoken });
    // res.json(user);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Interval Server Error");
  }
  // .then(user => res.json(user))
  // .catch(err=>{console.log(err)
  // res.json({error: 'Please enter a unique value for email' ,message: err.message})});
  // console.log(req.body);
  // const user = User(req.body);
  // user.save();
  // res.send(req.body);
  // console.log(req.body);
  // res.send("hello");
})

//ROUTE 2: Authenticate a User using : POST "/api/auth/login . Doesnt require Login

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {
  let success=false;
  //If there are errors, return Bad request and the errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success=false;
      return res.status(400).json({ error: "Please try to login with correct credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success=false;
      return res.status(400).json({success, error: "Please try to login with correct credentials" })
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success,authtoken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Interval Server Error");
  }
});


//ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required.
router.post('/getuser',fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Interval Server Error");
  }
})
module.exports = router;
