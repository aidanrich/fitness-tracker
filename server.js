const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3000;

const Workout = require("./models/workoutModel.js");
const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// change userdb?
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});



//need html routes?

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/exercise.html'))
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/stats.html'))
});


//api routes




// * View the combined weight of multiple exercises from the past seven workouts on the `stats` page.

app.get("/api/workouts/range", (req, res) => {
  console.log("hello mojo")

  Workout.find({})
  .sort({ _id: -1 })
  .limit(7).then((found) => {
      console.log("!!!!!!!!!" + found)
      res.json(found);
    })
    .catch(err => {
    console.log("err" + err)
  });
});


// * View the total duration of each workout from the past seven workouts on the `stats` page.

// * Add new exercises to a new workout plan.
app.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then(workoutData => {
      res.json(workoutData);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts", (req, res) => {
  Workout.find({}, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      res.json(found);
    }
  });
});



// Add exercises to the most recent workout plan.
app.put("/api/workouts/:id", (req, res) => {
  console.log(req.params.id)
  console.log(req.body);
  Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: req.body } }, (err, found) => {
    if (err) {
      console.log(err);
    } else {
      res.json(found);
    }
  })
})


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
