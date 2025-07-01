const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/M_User');
const validateToken = require('../middlewares/validateToken');
const nodemailer = require('nodemailer');

const router = express.Router();

/*
// Email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};*/

/* GROK START */
// Email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable
    pass: process.env.EMAIL_PASS, // Use environment variable
  },
});

// Validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Validate mobile number format
const validateMobile = (mobile) => {
  return /^\d{10}$/.test(mobile);
};

// Validate password format
const validatePassword = (password) => {
  return /^[A-Za-z0-9@_%\-]+$/.test(password);
};
/* GROK END */



// Register user
router.post('/register', async (req, res) => {
  const { username, firstname, lastname, countryPhoneCode, mobileNumber, email, password, dob } = req.body;
  // return res.status(400).json({ error: ' Well hello' });
  // Validate firstname and lastname to only have alphabets
  if (!/^[A-Za-z]+$/.test(firstname) || !/^[A-Za-z]+$/.test(lastname)) {
    return res.status(400).json({ error: 'Firstname and lastname must contain only alphabets' });
  }

  // Capitalize the first letter of firstname and lastname
  const formattedFirstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
  const formattedLastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);

  // Validate mobile number to have exactly 10 digits
  if (!/^\d{10}$/.test(mobileNumber)) {
    return res.status(400).json({ error: 'Mobile number must be 10 digits' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password to contain only numbers, alphabets, and @, _, -, %
  if (!/^[A-Za-z0-9@_%\-]+$/.test(password)) {
    return res.status(400).json({ error: 'Password can contain only numbers, alphabets and @, _, -, %' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    unm: username,
    fnm: formattedFirstname,
    lnm: formattedLastname,
    cPh: countryPhoneCode,
    mob: mobileNumber,
    eml: email,
    psw: hashedPassword,
    dob: dob,
    ver: 0,
    stt: true,
    e_nm: new Date(),
    str: new Date()
  });

  try {
    const savedUser = await user.save();

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: savedUser.uID, username: savedUser.unm, fullname: savedUser.fnm + savedUser.lnm },
      'kdhfbgaimdfwopqpfh',
      { expiresIn: '24h' }
    );

    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

    // Send verification email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'User registered successfully. Please check your email for verification link.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;




// Email verification route
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decodedToken = jwt.verify(token, 'kdhfbgaimdfwopqpfh');
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification link' });
    }

    user.verified = 1;
    await user.save();

    res.clearCookie('userToken');
    res.redirect('/login'); // Redirect to login page
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired verification link' });
  }
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Login user
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  //return res.status(400).json({ error: ' Well hello' });
  try {
    // Find the user by email or phone number// Find the user by email or phone number
    const user = await User.findOne({ 
      $or: [
        { email: identifier },
        { phone: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials1' });
    }

    if (!password || !user.psw) {
      return res.status(401).json({ error: 'Invalid credentials2' });
    }

    if (typeof password !== 'string') {
      return res.status(401).json({ error: 'Invalid credentials3' });
    }

    bcrypt.compare(password, user.psw, (err, match) => {
      if (err || !match) {
        return res.status(401).json({ error: 'Invalid credentials4' });
      }

      const token = jwt.sign(
        { userId: user.uID, username: user.unm, fullname: user.fnm + user.lnm },
        'kdhfbgaimdfwopqpfh',
        { expiresIn: '48h' }
      );

      res.json({ message: 'Login successful', token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('userToken');
  res.json({ message: 'Logged out successfully' });
});

router.get('/profile', validateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});











//Grok implemented ----

// 1. Register user
router.post('/register', async (req, res) => {
  const {
    username,
    firstname,
    middlename,
    lastname,
    nickname,
    email,
    password,
    countryPhoneCode,
    mobileNumber,
    dob,
  } = req.body;

  try {
    // Validate inputs
    if (!username || !firstname || !lastname || !email || !password || !mobileNumber || !dob) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!/^[A-Za-z]+$/.test(firstname) || !/^[A-Za-z]+$/.test(lastname)) {
      return res.status(400).json({ error: 'Firstname and lastname must contain only alphabets' });
    }

    if (!validateMobile(mobileNumber)) {
      return res.status(400).json({ error: 'Mobile number must be 10 digits' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password can contain only numbers, alphabets, and @, _, -, %' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ eml: email }, { mob: mobileNumber }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or mobile number already registered' });
    }

    // Format names
    const formattedFirstname = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
    const formattedMiddlename = middlename
      ? middlename.charAt(0).toUpperCase() + middlename.slice(1).toLowerCase()
      : '';
    const formattedLastname = lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      unm: username,
      fnm: formattedFirstname,
      mnm: formattedMiddlename,
      lnm: formattedLastname,
      nik: nickname || '',
      eml: email,
      psw: hashedPassword,
      cPh: countryPhoneCode || '+91',
      mob: mobileNumber,
      dob: new Date(dob),
      ver: 0, // Unverified
      stt: 0, // Unverified status
      e_nm: new Date(),
      str: new Date(),
      on: new Date(),
    });

    const savedUser = await user.save();

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: savedUser.uID, username: savedUser.unm },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );

    // Send verification email
    const verificationLink = `${process.env.APP_URL}/api/users/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'User registered successfully. Please check your email for verification link.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// 2. Verify email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ uID: decodedToken.userId });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification link' });
    }

    if (user.ver === 1) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    user.ver = 1; // Verified
    user.stt = 6; // Verified status
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired verification link' });
  }
});

// 3. Login user
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ eml: identifier }, { mob: identifier }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const match = await bcrypt.compare(password, user.psw);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is verified
    if (user.ver !== 1) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.uID, username: user.unm, fullname: `${user.fnm} ${user.lnm}` },
      process.env.JWT_SECRET,
      { expiresIn: '48h' },
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Logout user
router.post('/logout', (req, res) => {
  // Client-side should remove the token; server just confirms
  res.json({ message: 'Logged out successfully' });
});

// 5. Get user profile
router.get('/profile', validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uID: req.user.userId }).select(
      'uID unm fnm mnm lnm nik eml mob dob cPh str stt',
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Profile retrieved successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 6. Get user by uID
router.get('/users/:uID', validateToken, async (req, res) => {
  try {
    const { uID } = req.params;
    const user = await User.findOne({ uID }).select(
      'uID unm fnm mnm lnm nik eml mob dob cPh str stt pDP aDP cDP h_m h_e',
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 7. Get all users (with filters)
router.get('/users', validateToken, async (req, res) => {
  try {
    const { unm, eml, page = 1, limit = 10 } = req.query;
    const query = {};
    if (unm) query.unm = { $regex: unm, $options: 'i' };
    if (eml) query.eml = { $regex: eml, $options: 'i' };

    const users = await User.find(query)
      .select('uID unm fnm lnm eml mob str stt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 8. Update user profile
router.put('/users/:uID', validateToken, async (req, res) => {
  try {
    const { uID } = req.params;
    const {
      username,
      firstname,
      middlename,
      lastname,
      nickname,
      email,
      mobileNumber,
      countryPhoneCode,
      dob,
      password,
    } = req.body;

    // Ensure user can only update their own profile
    if (req.user.userId !== parseInt(uID)) {
      return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    const user = await User.findOne({ uID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate inputs
    if (firstname && !/^[A-Za-z]+$/.test(firstname)) {
      return res.status(400).json({ error: 'Firstname must contain only alphabets' });
    }
    if (lastname && !/^[A-Za-z]+$/.test(lastname)) {
      return res.status(400).json({ error: 'Lastname must contain only alphabets' });
    }
    if (mobileNumber && !validateMobile(mobileNumber)) {
      return res.status(400).json({ error: 'Mobile number must be 10 digits' });
    }
    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password && !validatePassword(password)) {
      return res.status(400).json({ error: 'Password can contain only numbers, alphabets, and @, _, -, %' });
    }

    // Check for duplicate email or mobile
    if (email && email !== user.eml) {
      const existingEmail = await User.findOne({ eml: email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }
    if (mobileNumber && mobileNumber !== user.mob) {
      const existingMobile = await User.findOne({ mob: mobileNumber });
      if (existingMobile) {
        return res.status(400).json({ error: 'Mobile number already registered' });
      }
    }

    // Update fields
    if (username) user.unm = username;
    if (firstname) user.fnm = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
    if (middlename) user.mnm = middlename.charAt(0).toUpperCase() + middlename.slice(1).toLowerCase();
    if (lastname) user.lnm = lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();
    if (nickname) user.nik = nickname;
    if (email) user.eml = email;
    if (mobileNumber) user.mob = mobileNumber;
    if (countryPhoneCode) user.cPh = countryPhoneCode;
    if (dob) user.dob = new Date(dob);
    if (password) user.psw = await bcrypt.hash(password, 10);
    user.e_nm = new Date(); // Update name edited date

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 9. Delete user (soft delete)
router.delete('/users/:uID', validateToken, async (req, res) => {
  try {
    const { uID } = req.params;

    // Ensure user can only delete their own profile
    if (req.user.userId !== parseInt(uID)) {
      return res.status(403).json({ error: 'Unauthorized to delete this profile' });
    }

    const user = await User.findOne({ uID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.stt = 3; // Deleted status
    await user.save();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 10. Update user status
router.put('/users/:uID/status', validateToken, async (req, res) => {
  try {
    const { uID } = req.params;
    const { stt } = req.body;

    // Ensure user can only update their own status (or admin logic if applicable)
    if (req.user.userId !== parseInt(uID)) {
      return res.status(403).json({ error: 'Unauthorized to update this status' });
    }

    const validStatuses = [0, 1, 2, 3, 4, 5, 6]; // Based on schema: fine, suspension, deletion, deleted, deactivation, verified, unverified
    if (!validStatuses.includes(stt)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await User.findOne({ uID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.stt = stt;
    await user.save();
    res.json({ message: 'Status updated successfully', uID, stt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 11. Update privacy settings
router.put('/users/:uID/privacy', validateToken, async (req, res) => {
  try {
    const { uID } = req.params;
    const { h_m, h_e, pDP, aDP, cDP } = req.body;

    // Ensure user can only update their own privacy settings
    if (req.user.userId !== parseInt(uID)) {
      return res.status(403).json({ error: 'Unauthorized to update privacy settings' });
    }

    const user = await User.findOne({ uID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update privacy fields
    if (typeof h_m === 'boolean') user.h_m = h_m;
    if (typeof h_e === 'boolean') user.h_e = h_e;
    if (typeof pDP === 'boolean') user.pDP = pDP;
    if (typeof aDP === 'boolean') user.aDP = aDP;
    if (typeof cDP === 'boolean') user.cDP = cDP;

    await user.save();
    res.json({ message: 'Privacy settings updated successfully', privacy: { h_m: user.h_m, h_e: user.h_e, pDP: user.pDP, aDP: user.aDP, cDP: user.cDP } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});







module.exports = router;