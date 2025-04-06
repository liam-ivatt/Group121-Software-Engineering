const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const requireLogin = require('./middleware/auth');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

// For req.body
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://liammivatt:Galaxytheo2020@healthtracker.vlneqzh.mongodb.net/HealthTracker?retryWrites=true&w=majority")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(session({
  secret: 'galaxy',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb+srv://liammivatt:Galaxytheo2020@healthtracker.vlneqzh.mongodb.net/?retryWrites=true&w=majority&appName=HealthTracker"}),
  cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 }
}));

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password, height, weight } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use, please choose another' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const bmi = weight / ((height / 100) ** 2);

  const user = new User({ firstName, lastName, email, password: hashedPassword, height, weight, bmi });
  await user.save();

  req.session.userId = user._id;
  res.json({ message: 'User registered', userId: user._id });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) return res.status(400).json({ message: 'Incorrect email or password' });
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect email or password' });
  
    req.session.userId = user._id;
    res.json({ message: 'Logged in' });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });  
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
  
