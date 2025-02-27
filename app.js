// Import required modules
var createError = require('http-errors'); // For creating HTTP errors
var express = require('express'); // Express framework
var path = require('path'); // For handling file paths
var cookieParser = require('cookie-parser'); // For parsing cookies
var logger = require('morgan'); // For logging requests
const session = require('express-session'); // For session management
const passport = require('passport'); // For authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth strategy
const FacebookStrategy = require('passport-facebook').Strategy; // Facebook OAuth strategy
require('dotenv').config(); // Load environment variables from .env file
var mongoose = require('mongoose'); // MongoDB object modeling tool
var User = require('./models/user'); // User model
const errorHandler = require('./middlewares/errorHandling')


// Import routers
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var authenticationRouter = require('./routes/auth');
var apiRouter = require('./routes/api');

var app = express(); // Create an Express application

// MongoDB connection URI
const mongoURI =  process.env.MongoDB_url||'mongodb://localhost:27017/Arni'; // or use MongoDB Atlas URI

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error: ', err));

// View engine setup
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'ejs'); // Set the view engine to EJS

// Middleware setup
app.use(logger('dev')); // Log requests to the console
app.use(express.json( { limit: "100mb" })); // Parse JSON request bodies
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
app.use(errorHandler);

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Use environment variable for session secret
  resave: false, // Prevents unnecessary session resaving
  saveUninitialized: false, // Don't save uninitialized sessions
  cookie: {
      secure: false, // Set true if using HTTPS
      httpOnly: true, // Prevent client-side access to cookies
      maxAge: 1000 * 60 * 15 // 15 minutes session expiry
  }
}));

// Passport.js configuration
passport.serializeUser ((user, done) => {
  done(null, user); // Serialize user into the session
});

passport.deserializeUser ((user, done) => {
  done(null, user); // Deserialize user from the session
});

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret
  callbackURL: process.env.GOOGLE_CALLBACK_URL // Callback URL after authentication
}, (accessToken, refreshToken, profile, done) => {
  // Save user info to session or database
  return done(null, profile); // Pass the user profile to the next middleware
}));

// Facebook OAuth strategy configuration
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID, // Facebook app ID
  clientSecret: process.env.FACEBOOK_APP_SECRET, // Facebook app secret
  callbackURL: process.env.FACEBOOK_CALLBACK_URL, // Callback URL after authentication
  profileFields: ['id', 'displayName', 'email', 'picture.type(large)'], // Requesting email and profile picture
  scope: ['email'] // Ensure this is included to request email
}, (accessToken, refreshToken, profile, done) => {
  // Process user profile here
  console.log(profile); // Log the user profile
  return done(null, profile); // Pass the user profile to the next middleware
}));

// Middleware to check authentication and block status
const checkAuthenticationAndBlockStatus = async (req, res, next) => {
  try {
      // Check if the user is authenticated
      if (!req.session.isAuthenticated) {
          return next(); // If not authenticated, proceed to the next middleware
      }

      // Check if email exists in session
      const email = req.session.email;
      if (!email) {
          return res.status(400).send("Session email is missing."); // Handle missing email
      }

      // Check if the email is blocked
      const isBlocked = await User.findOne({ email: email, status: 'Suspended' });
      if (isBlocked) {
        req.session.isAuthenticated = false; // Mark user as not authenticated
          return res.redirect('/blocked'); // Redirect to blocked page
      }

      // If not blocked, proceed to the next middleware
      next();
  } catch (error) {
      console.error("Error in authentication and block status middleware:", error);
      res.status(500).send("Internal Server Error"); // Handle internal server error
  }
};

// Use the middleware
// app.use(checkAuthenticationAndBlockStatus); // Apply the authentication check middleware

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session()); // Use session support for Passport

// Define routes
app.use('/', indexRouter); // Home route
app.use('/users', userRouter); // User-related routes
app.use('/admin', adminRouter); // Admin-related routes
app.use('/auth', authenticationRouter); // Authentication-related routes
app.use('/api', apiRouter); // API-related routes

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404)); // Create a 404 error
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message; // Set error message
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // Provide error details in development

  // Render the error page
  res.status(err.status || 500); // Set response status
  res.render('error'); // Render error view
});

// Export the app module
module.exports = app;