const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();
const PORT = 5000;
const MongoURI = "mongodb+srv://liammivatt:Galaxytheo2020@healthtracker.vlneqzh.mongodb.net/HealthTracker?retryWrites=true&w=majority"

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

// For req.body
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create MongoDB session store
const store = new MongoStore({
  uri: MongoURI,
  collection: 'sessions'
});

// Session config
app.use(session({
  secret: 'galaxy',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 }
}));

// Register new user
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, userName, email, password, height, weight } = req.body;

  const existingEmail = await User.findOne({ email });
  const existingUserName = await User.findOne({ userName });

  if (existingEmail && existingUserName) {
    return res.status(400).json({ message: 'Email and user name already in use, please choose another' });
  } else if (existingUserName) {
    return res.status(400).json({ message: 'User name already in use, please choose another' });
  } else if (existingEmail) {
    return res.status(400).json({ message: 'Email already in use, please choose another' });
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  const bmi = weight / ((height / 100) ** 2);

  const user = new User({ firstName, lastName, userName, email, password: hashedPassword, height, weight, bmi });
  await user.save();

  res.json({ message: 'User registered', userId: user._id });
});

// Login and create session
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) return res.status(400).json({ message: 'Incorrect email or password' });
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Incorrect email or password' });
  
  req.session.userId = user._id;

  res.json({ message: 'Logged in' });
});

// Logout and remove current session (protects the main page)
app.post('/api/logout', (req, res) => {

  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ message: 'Failed to log out' });
      }
      res.clearCookie('connect.sid', {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: 0
      });
      res.status(200).json({ message: 'Logged out successfully' });
  });
});

// TO-DO: Fix profile update
app.post('/api/update-profile', async (req, res) => {

  const { email, height, weight } = req.body;
  const user = await User.findById(req.session.userId);

  user.email = email;
  user.height = height;
  user.weight = weight;

  await user.save()

  res.status(200).json({ message: 'Profile updated' });

});

// Authorise session
app.get('/api/check-auth', (req, res) => {
  if (req.session && req.session.userId) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Get user data
app.get('/api/user', async (req, res) => {
  
  const user = await User.findById(req.session.userId);
  res.json({ firstName: user.firstName, lastName: user.lastName, userName: user.userName, email: user.email, height: user.height, weight: user.weight, bmi: user.bmi });

});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
  
