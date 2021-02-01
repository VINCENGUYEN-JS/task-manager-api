const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateToken();
    res.status(201).send({
      user,
      token,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateToken();

    res.send({
      token,
      user,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      ({ token }) => token !== req.token
    );
    await req.user.save();

    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(400).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdated = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((bodyKey) =>
    allowedUpdated.includes(bodyKey)
  );
  const user = req.user;

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid update!" });

  try {
    updates.forEach((bodyKey) => {
      user[bodyKey] = req.body[bodyKey];
    });

    await user.save();

    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    return res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
