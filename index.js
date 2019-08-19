const express = require("express");

const app = express();

app.use(express.json());

const port = 3333;

const projects = [];
let numReqs = 0;

function resCount(req, res, next) {
  numReqs++;
  console.log("requisições: ", numReqs);
  return next();
}
app.use(resCount);
/*
app.use((req, res, next) => {
  numReqs++;
  console.log("requisições: ", numReqs);
  return next();
}); */

function checkTaskId(req, res, next) {
  const { id } = req.params;
  const index = projects.findIndex(x => x.id == id);
  if (index > -1) {
    return next();
  }
  return res.status(400).json({ error: "id dos not exists" });
}

app.get("/projects", (req, res) => {
  res.json(projects);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;
  /*
  let obj = { id: id, title: title, tasks: [] };*/
  const obj = { id, title, tasks: [] };
  projects.push(obj);
  return res.json(obj);
});

app.put("/projects/:id", checkTaskId, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  /*
  refatorado conforme codigo do diego
  const index = projects.findIndex(x => x.id == id);
  projects[index].title = title;
  return res.json(projects[index]);*/
  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(project);
});

app.delete("/projects/:id", checkTaskId, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(x => x.id == id);
  projects.splice(index, 1);
  return res.json(projects);
});

app.post("/projects/:id/tasks", checkTaskId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  /*
  refatorado conforme codigo do diego
  const index = projects.findIndex(x => x.id == id);
  projects[index].tasks.push(title);
  return res.json(projects[index]);
  */
  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.json(project);
});

app.listen(port, function() {
  console.info("Running on port ", port);
});
