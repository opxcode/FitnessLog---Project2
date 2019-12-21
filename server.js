////Dependencies
const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');

//Port
const PORT = process.env.PORT || 3000;

console.log(`Your port is ${process.env.PORT}`); // 3000

// Middleware
// allows us to use put and delete methods
app.use(methodOverride('_method'));
// parse info from our input fields into an object
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
//tells express to try to match requests with files in the directory called 'public'
//custom middleware for authentication
app.use(
  session({
    secret: 'asdaasdad',
    resave: false,
    saveUninitialized: false
  })
);

// Database

const mongoURI = process.env.MONGOURI || 'mongodb://localhost/fitnessapp';

//connect to this database - don't forget to start `mongod`
mongoose.connect(mongoURI);

//set the connection to constiable for easy access`
const db = mongoose.connection;

//  use this fancy looking stuff to get more useful error messages in your console
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('DB: Connected');
});

// const mongoURI = 'localhost:27017/workouts';

// mongoose.connect(mongoURI, { useNewUrlParser: true });
// mongoose.connection.once('open', () => {
//   console.log('connected to mongo');
// });

// Use Controllers and Routes
app.get('/', (req, res) => {
  res.sendfile('./public/main.html');
});
const workoutController = require('./controllers/workouts.js');
app.use('/workouts', workoutController);
const usersController = require('./controllers/users.js');
app.use('/users', usersController);
const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

//Listener
app.listen(PORT, () => console.log('Port,Listening...', PORT));
