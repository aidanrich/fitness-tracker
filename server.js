const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const Workout = require("./models/workoutModel.js");
const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// change userdb?
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true,
useFindAndModify: false,
useUnifiedTopology: true,
});

// make routes folder?

//need html routes

//api routes
app.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then(workout => {
      res.json(workout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts", (req, res) => {
  Workout.find().sort({ date: 1 }, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      res.json(found);
    }
  });
});



app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
  