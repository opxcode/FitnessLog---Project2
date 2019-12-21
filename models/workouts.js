const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  activity: { type: String, required: true },
  weight: { type: String },
  rep: { type: String },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
