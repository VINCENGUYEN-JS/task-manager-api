const express = require("express");
const { update } = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

const Task = require("../models/task");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET /tasks?completed=false
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const user = req.user;
  const match = {};
  const sort = {};
  //const task = await Task.find({owner:req.user._id})

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send();
    res.status(400).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdated = ["description", "completed"];
  const isValidOperation = updates.every((bodyKey) =>
    allowedUpdated.includes(bodyKey)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid update!" });

  try {
    const _id = req.params.id;
    // const task = await Task.findById(_id);

    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.status(404).send();

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    return res.status(200).send(task);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({
      _id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send();
    return res.status(200).send(task);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
