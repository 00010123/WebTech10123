const path = require("path");
const fs = require('fs');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// routes
const tasks = require("./routes/tasks");
const comments = require("./routes/comments");
const getCollection = require("./utils").getCollection;

// serving static files
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// setting template engine
app.set("view engine", "pug");

// notes urls
app.use("/tasks", tasks);
app.use("/comments", comments);

app.get("/", (req, res) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

app.get("/archive", (req, res) => {
  fs.readFile(getCollection('tasks.json'), (err, data) => {
    if (err) res.sendStatus(500)
    
    const tasks = JSON.parse(data).filter(task => task.archive == true)
    res.render("all_tasks", { title: "Hey", tasks: tasks });
  })
});

// listen for requests :)
const listener = app.listen(8000, () => {
  console.log(`App is listening on port  http://localhost:8000`);
});
