//Dependencies
const express = require('express');
const router = express.Router();
const moment = require('moment');

//Controllers/Routes
//___________________
//7 Restful Routes
//___________________
// Index  : GET    '/workouts'          1/7
// New    : GET    '/workouts/new'      3/7
// Create : POST   '/workouts'          4/7
// Edit   : GET    '/workouts/:id/edit' 5/7
// Update : PUT    '/workouts/:id'      6/7
// Delete : DELETE '/workouts/:id'      7/7

const Workout = require('../models/workouts.js');
const workoutSeed = require('../models/seed.js');
const User = require('../models/users.js');

//Seed
// const workouts = [
//   { date: '15/11/19', activity: 'Deadlift', weight: '10kg', rep: '3X12' }
// ];

router.get('/seed', (req, res) => {
  Workout.insertMany(workoutSeed, (err, workouts) => {
    if (err) {
      console.log(err);
    } else {
      res.send(workouts);
    }
  });
});
// router.post('/seed', (req, res) => {
//   Workout.create(workoutSeed, (err, data) => {
//     if (err) console.log(err.message);
//     console.log('seed data');
//   });
// });

// Index  : GET    '/workouts'          1/7
router.get('/', (req, res) => {
  console.log(req.query);
  Workout.find({ user: req.session.currentUser._id }, (err, workouts) => {
    User.findById(req.session.currentUser._id, (err, user) => {
      if (err) {
      }
      if (req.query.nextmonth) {
        let dateString = '01-' + req.query.dateView;
        let parts = dateString.split('-');
        console.log(parts);
        let dateView = new Date();
        // let dateView= new Date(req.query.dateView);
        dateView.setMonth(dateView.getMonth() + 1);
        console.log(moment(dateView).format('MM-YYYY'));
        //add 1 month to dateView
        res.render('./workouts/index.ejs', {
          workouts: workouts,
          moment: moment,
          user: user,
          dateView: dateView
        });
      }
      if (req.query.prevmonth) {
        let dateString = '01-' + req.query.dateView;
        let parts = dateString.split('-');
        console.log(parts);
        let dateView = new Date();
        dateView.setMonth(dateView.getMonth() - 1);
        console.log(dateView);
        //add 1 month to dateView
        res.render('./workouts/index.ejs', {
          workouts: workouts,
          moment: moment,
          user: user,
          dateView: dateView
        });
      } else {
        let dateView = new Date();
        res.render('./workouts/index.ejs', {
          workouts: workouts,
          moment: moment,
          user: user,
          dateView: dateView
        });
      }
    });
  });
});

// New    : GET    '/workouts/new'      3/7
// Order matters! must be above /prodcuts/:id or else this route will never get hit
router.get('/new', (req, res) => {
  res.render('./workouts/new.ejs');
});

// // Show   : GET    '/workouts/:id'      2/7
// router.get('/:id', (req, res) => {
//   Product.findById(req.params.id, (err, product) => {
//     if (err) {
//       console.log(err);
//     }
//     res.render('./workouts/show.ejs', { product: product });
//   });
// });

// router.post('/', (req, res) => {
//   User.findOne({ username: req.body.username }, (err, foundUser) => {
//     if (bcrypt.compareSync(req.body.password, foundUser.password)) {
//       req.session.currentUser = foundUser;
//       res.redirect('/');
//     } else {
//       res.send('<a href="/">wrong password</a>');
//     }
//   });
// });

// // Create : POST   '/workouts'          4/7
router.post('/', (req, res) => {
  if (req.session.currentUser) req.body.user = req.session.currentUser._id;

  Workout.create(req.body, (err, workouts) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/workouts/');
    }
  });
});

// Create
// router.post('/', (req, res) => {
//   Workout.push(req.body);
//   res.redirect('/workouts');
// });

// // Edit   : GET    '/workouts/:id/edit' 5/7
router.get('/:id/edit', (req, res) => {
  Workout.findById(req.params.id, (err, workouts) => {
    if (err) {
      console.log(err);
    }
    res.render('./workouts/edit.ejs', {
      workouts: workouts,
      moment: moment
      //   workouts: workouts[req.params.id],
      //   id: req.params.id
    });
  });
});

// // Update : PUT    '/workouts/:id'      6/7
router.put('/:id', (req, res) => {
  Workout.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, product) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/workouts/');
    }
  );
});

// // Update
// router.put('/:id', (req, res) => {
//   Workout[req.params.id] = req.body; //in our fruits array, find the index that is specified in the url (:index).  Set that element to the value of req.body (the input data)
//   res.redirect('/workouts'); //redirect to the index page
// });

// // Delete : DELETE '/workouts/:id'      7/7
router.delete('/:id', (req, res) => {
  Workout.findByIdAndRemove(req.params.id, (err, workouts) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/workouts');
  });
});
// Delete
// router.delete('/:id', (req, res) => {
//   Workout.splice(req.params.id, 1); //remove the item from the array
//   res.redirect('/workouts'); //redirect back to index route
// });
//Seed

module.exports = router;
