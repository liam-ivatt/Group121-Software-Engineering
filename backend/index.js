const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const MONGODB_API_KEY = process.env.MONGODB_API_KEY;
const EMAIL_APP_KEY = process.env.EMAIL_API_KEY;

const User = require("./models/User");
const Group = require("./models/Group");
const Foods = require("./models/Foods");

const app = express();
const PORT = 5000;
const MongoURI = MONGODB_API_KEY;

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// For req.body
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create MongoDB session store
const store = new MongoStore({
  uri: MongoURI,
  collection: "sessions",
});

// Session config
app.use(
  session({
    secret: "galaxy",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 },
  })
);

async function sendEmail(to, subject, text) {
  html = `<h1>Health Tracker App</h1>
          <p>You've been invited to a group! Enter ${text} to join!`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "healthtrackeruea@gmail.com",
      pass: EMAIL_APP_KEY,
    },
  });

  const info = await transporter.sendMail({
    from: "Health Tracker <info@healthtracker.uea.ac.uk>",
    to: to,
    subject: subject,
    html: html,
  });
}

// Register new user
app.post("/register", async (req, res) => {
  const { firstName, lastName, userName, email, password, height, weight } =
    req.body;

  const existingEmail = await User.findOne({ email });
  const existingUserName = await User.findOne({ userName });

  if (existingEmail && existingUserName) {
    return res
      .status(400)
      .json({
        message: "Email and user name already in use, please choose another",
      });
  } else if (existingUserName) {
    return res
      .status(400)
      .json({ message: "User name already in use, please choose another" });
  } else if (existingEmail) {
    return res
      .status(400)
      .json({ message: "Email already in use, please choose another" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const bmi = weight / (height / 100) ** 2;

  const user = new User({
    firstName,
    lastName,
    userName,
    email,
    password: hashedPassword,
    height,
    weight,
    bmi,
    weightHistory: [{ weight: weight, date: new Date() }],
    goalCurrentlyActive: 0,
  });

  await user.save();

  res.json({ message: "User registered", userId: user._id });
});

// Login and create session
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Incorrect email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ message: "Incorrect email or password" });

  req.session.userId = user._id;

  res.json({ message: "Logged in" });
});

// Logout and remove current session (protects the main page)
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Update Profile
app.post("/update-profile", async (req, res) => {
  const { email, height } = req.body;

  const user = await User.findById(req.session.userId);

  user.email = email || user.email;
  user.height = height || user.height;

  await user.save();

  res.status(200).json({ message: "Profile updated" });
});

// Authorise session
app.get("/check-auth", (req, res) => {
  if (req.session && req.session.userId) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Get user data
app.get("/user", async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    height: user.height,
    weight: user.weight,
    bmi: user.bmi,
    weightHistory: user.weightHistory,
    exerciseHistory: user.exerciseHistory,
    goalsHistory: user.goalsHistory,
    goalCurrentlyActive: user.goalCurrentlyActive,
    groups: user.groups,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Exercise CRUD
app.post("/add-exercise", async (req, res) => {
  const { exercise, exerciseStat, date } = req.body;
  const user = await User.findById(req.session.userId);

  if (exerciseStat < 0 || exerciseStat > 1000) {
    return res
      .status(400)
      .json({
        message: "Exercise duration/distance must be between 0 and 1000",
      });
  }

  user.exerciseHistory.push({ exercise, exerciseStat, date });
  await user.save();

  res.status(200).json({ message: "Exercise entry added" });
});

app.delete("/delete-exercise", async (req, res) => {
  const { id } = req.body;

  const user = await User.findByIdAndUpdate(
    req.session.userId,
    { $pull: { exerciseHistory: { _id: id } } },
    { new: true }
  );

  res.status(200).json({
    message: "Exercise deleted successfully",
    remainingExercises: user.exerciseHistory,
  });
});

// GOALS CRUD
app.post("/create-goal", async (req, res) => {
  const { goalName, targetWeight, targetDate } = req.body;
  const user = await User.findById(req.session.userId);

  //Checks whether the user has a goal currently active
  if (user.goalCurrentlyActive == 1) {
    return res
      .status(400)
      .json({
        message:
          "You currently have a goal active. If you would like to overwrite it, please delete your currently active goal first",
      });
  }

  //Checks whether the goalName already exists
  const existingGoalName = await user.goalsHistory.find(
    (goal) => goal.goalName === goalName
  );
  if (existingGoalName) {
    return res
      .status(400)
      .json({ message: "Goal name already exists, please choose another" });
  }

  //Checks whether the weight entered is both smaller than the currentWeight (if they are not underweight already) and not an unhealthy weight
  const newBMI = targetWeight / (user.height / 100) ** 2;
  if (user.weight < targetWeight && user.bmi > 18.5) {
    return res
      .status(400)
      .json({ message: "Target weight is larger than your current weight!" });
  } else if (newBMI < 18.5) {
    return res
      .status(400)
      .json({
        message:
          "Target weight would lead to you having a BMI of under 18.5 which is not recommended, please select another weight",
      });
  }

  //Checks whether the date chosen is valid
  const currentDate = new Date().toJSON().slice(0, 10);
  if (targetDate < currentDate) {
    return res
      .status(400)
      .json({ message: "Target date is unavailable, please choose another" });
  }

  user.goalsHistory.push({ goalName, targetWeight, targetDate });
  user.goalCurrentlyActive = 1;
  await user.save();

  return res
    .status(201)
    .json({ message: "Goal successfully created - Well done, and good luck!" });
});

// GROUP CRUD
app.post("/create-group", async (req, res) => {
  const { groupName } = req.body;
  const user = await User.findById(req.session.userId);

  const existingGroup = await Group.findOne({ groupName });
  if (existingGroup) {
    return res.status(400).json({ message: "Group name already exists" });
  }

  const group = new Group({
    groupName,
    groupOwner: user._id,
    groupMembers: [user._id],
    joinCode: Math.random().toString(36).substring(2),
  });

  await group.save();

  res.status(200).json({ message: "Group created successfully" });
});

app.get("/get-groups", async (req, res) => {
  const groups = await Group.find({
    groupMembers: req.session.userId,
  })
    .populate("groupOwner", "userName firstName lastName email")
    .populate("groupMembers", "userName firstName lastName email");

  const formattedGroups = groups.map((group) => {
    return {
      id: group._id,
      name: group.groupName,
      userId: req.session.userId,
      ownerId: group.groupOwner._id,
      members: group.groupMembers,
      joinCode: group.joinCode,
    };
  });

  res.status(200).json({ formattedGroups });
});

app.delete("/delete-group", async (req, res) => {
  const { groupId } = req.body;

  const group = await Group.findById(groupId);

  if (group.groupOwner.toString() !== req.session.userId.toString()) {
    return res
      .status(403)
      .json({ message: "Only the group owner can delete this group" });
  }

  await Group.findByIdAndDelete(groupId);
  res.status(200).json({ message: "Group deleted successfully" });
});

app.post("/join-group", async (req, res) => {
  const { joinCode } = req.body;

  const group = await Group.findOne({ joinCode });

  if (!group) {
    return res.status(404).json({ message: "Invite code not valid" });
  }

  const user = await User.findById(req.session.userId);

  if (group.groupMembers.includes(user._id)) {
    return res
      .status(400)
      .json({ message: "You are already a member of this group" });
  }

  group.groupMembers.push(user._id);
  await group.save();

  res.status(200).json({ message: "Group joined successfully" });
});

app.post("/update-group", async (req, res) => {
  const { groupId, groupName } = req.body;

  const existingGroup = await Group.findOne({ groupName });
  if (existingGroup) {
    return res.status(400).json({ message: "Group name already exists" });
  }

  const group = await Group.findById(groupId);

  group.groupName = groupName || group.groupName;

  await group.save();

  res.status(200).json({ message: "Group updated successfully" });
});

app.post("/leave-group", async (req, res) => {
  const { id } = req.body;

  const group = await Group.findById(id);
  const user = await User.findById(req.session.userId);

  if (!group.groupMembers.includes(user._id)) {
    return res
      .status(400)
      .json({ message: "You are not a member of this group" });
  }

  group.groupMembers = group.groupMembers.filter(
    (member) => !member.equals(user._id)
  );

  await group.save();
  res.status(200).json({ message: "Left group successfully" });
});

app.delete("/delete-group-member", async (req, res) => {
  const { groupId, userId } = req.body;

  const group = await Group.findById(groupId);
  const user = await User.findById(userId);

  group.groupMembers = group.groupMembers.filter(
    (member) => !member.equals(user._id)
  );

  await group.save();
});

app.post("/invite-group-member", async (req, res) => {
  const { joinCode, userEmail } = req.body;

  const existingUser = await User.findOne({ email: userEmail });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  await sendEmail(userEmail, "Group Invite", joinCode);

  res.status(200).json({ message: "Invite sent successfully" });
});

//GOAL SUGGESTION
app.post("/suggest-goal", async (req, res) => {
  const user = await User.findById(req.session.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { goalsHistory, weight, height } = user;
  let suggestedGoal = {};

  // Calculate minimum safe weight using BMI of 18.5
  const minWeight = 18.5 * Math.pow(height / 100, 2);

  if (!Array.isArray(goalsHistory) || goalsHistory.length === 0) {
    // Default 5% weight loss in 3 months
    const defaultWeightLoss = weight * 0.05;
    const defaultTargetWeight = Math.max(weight - defaultWeightLoss, minWeight);

    const defaultTargetDate = new Date();
    defaultTargetDate.setDate(defaultTargetDate.getDate() + 90);

    suggestedGoal = {
      goalName: "Lose 5% of weight in 3 months",
      targetWeight: defaultTargetWeight.toFixed(0),
      targetDate: defaultTargetDate.toISOString().split("T")[0],
    };
  } else {
    let totalWeightChange = 0;
    let totalDays = 0;

    // Calculate average daily change based on previous goals
    for (let i = 1; i < goalsHistory.length; i++) {
      const previous = goalsHistory[i - 1];
      const current = goalsHistory[i];

      const daysDiff =
        (new Date(current.targetDate) - new Date(previous.targetDate)) /
        (1000 * 60 * 60 * 24);
      if (daysDiff <= 0) continue;

      const weightChange =
        parseFloat(previous.targetWeight) - parseFloat(current.targetWeight);
      totalWeightChange += weightChange;
      totalDays += daysDiff;
    }

    const averageDailyChange =
      totalDays > 0 ? totalWeightChange / totalDays : 0;
    const expectedWeightChange = averageDailyChange * 90;
    const newTargetWeight = Math.max(
      weight - expectedWeightChange,
      minWeight
    ).toFixed(0);

    const newTargetDate = new Date();
    newTargetDate.setDate(newTargetDate.getDate() + 90);

    suggestedGoal = {
      goalName: `Reach ${newTargetWeight} kg in 3 months`,
      targetWeight: newTargetWeight,
      targetDate: newTargetDate.toISOString().split("T")[0],
    };
  }

  console.log(suggestedGoal);
  return res.status(200).json({ suggestedGoal });
});

//GOAL DELETE
app.delete("/delete-goal", async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(req.session.userId);

  const activeGoal = user.goalsHistory[user.goalsHistory.length - 1];

  if (activeGoal && activeGoal._id.toString() === id) {
    user.goalCurrentlyActive = 0;
  }

  user.goalsHistory = user.goalsHistory.filter(
    (goal) => goal._id.toString() !== id
  );
  await user.save();

  res.status(200).json({
    message: "Goal deleted successfully",
    remainingGoals: user.goalsHistory,
  });
});

//Food CRUD
//Create a new meal
app.post("/meals", async (req, res) => {
  try {
    const { name, calories } = req.body;

    if (!name || !calories) {
      return res
        .status(400)
        .json({ message: "Meal name and calorie amount required" });
    }

    const meal = new Foods({
      name,
      calories,
      user: req.session.userId,
    });

    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ message: "Error creating meal" });
  }
});

//Delete meal
app.delete("/meals/:id", async (req, res) => {
  try {
    const meal = await Foods.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ message: "Error deleting meal" });
  }
});

//Get meals today and calorie amount
app.get("/meals/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const meals = await Foods.find({
      user: req.session.userId,
      creationDate: { $gte: today },
    });

    const totalCals = meals.reduce((sum, meal) => sum + meal.calories, 0);

    res.json({
      count: meals.length,
      totalCals,
      meals,
    });
  } catch (error) {
    console.error("Error fetching today's meals:", error);
    res.status(500).json({ message: "Error fetching daily meals" });
  }
});

//Get all meals
app.get("/meals", async (req, res) => {
  try {
    const meals = await Foods.find({
      user: req.session.userId,
    }).sort({ creationDate: -1 });

    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ message: "Error fetching meals" });
  }
});

//Weight CRUD
app.post("/set-weight", async (req, res) => {
  const { weight } = req.body;

  if (weight && (weight < 0 || weight > 500)) {
    return res
      .status(400)
      .json({ message: "Weight must be between 0KG and 500KG" });
  }

  const user = await User.findById(req.session.userId);

  user.weight = weight;

  if (weight) {
    user.bmi = user.weight / (user.height / 100) ** 2;
    user.weightHistory.push({ weight: weight, date: new Date() });
  }

  res.status(200).json({ message: "Weight set successfully!" });

  await user.save();
});

app.delete("/delete-weight", async (req, res) => {
  const { id } = req.body;

  await User.findByIdAndUpdate(
    req.session.userId,
    { $pull: { weightHistory: { _id: id } } },
    { new: true }
  );

  res.status(200).json({
    message: "Weight deleted successfully",
  });
});

app.post("/update-weight", async (req, res) => {
  const { weight } = req.body;

  const user = await User.findById(req.session.userId);

  user.weight = weight;

  if (weight) {
    user.bmi = user.weight / (user.height / 100) ** 2;
  }

  res.status(200).json({ message: "Weight set successfully!" });

  await user.save();
});

app.post('/update-goal-status', async (req, res) => {
  const { userId } = req.body;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      user.goalCurrentlyActive = 0;
      await user.save();

      res.status(200).json({ message: "Goal set to inactive" });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});
