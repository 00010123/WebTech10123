const fs = require('fs')
const path = require('path')

const express = require("express")
const router = express.Router()

const Validator = require("../services/validators")
const DbContext = require("../services/db")
const root = require("../utils").root;
const getCollection = require("../utils").getCollection;

const dbc = new DbContext()
const v = new Validator()
dbc.useCollection("tasks.json")

router.get("/", (req, res) => {
  dbc.getAll(
    records => res.render("all_tasks", { tasks: records }),
    () => res.render("all_tasks", { tasks: null })
  )
})

router.get("/create-task", (req, res) => {
  res.render("create_task", {})
});

router.post("/create-task", (req, res) => {
  if (v.isValid(req.body)) {
    dbc.saveOne(req.body, () => res.render("create_task", { success: true }))
  } else {
    res.render("create_task", { error: true, success: false })
  }
})

router.get('/:id/delete', (req, res) => {
  dbc.deleteOne(
    req.params.id, 
    () => res.redirect('/')),
    () => res.sendStatus(500)
})

router.get("/:id/archive", (req, res) => {
  fs.readFile(getCollection('tasks.json'), (err, data) => {
    if (err) res.sendStatus(500)

    const tasks = JSON.parse(data)
    const task = tasks.filter(task => task.id == req.params.id)[0]
    const taskIdx = tasks.indexOf(task)
    const splicedTask = tasks.splice(taskIdx, 1)[0]
    splicedTask.archive = true
    tasks.push(splicedTask)

    fs.writeFile(getCollection('tasks.json'), JSON.stringify(tasks), err => {
      if (err) res.sendStatus(500)

      res.redirect('/tasks')
    })
    
  })
})

router.get("/:id", (req, res) => {
  dbc.getOne(
    req.params.id,
    record => res.render("task_detail", { task: record }),
    () => res.sendStatus(404)
  )
})

module.exports = router;

