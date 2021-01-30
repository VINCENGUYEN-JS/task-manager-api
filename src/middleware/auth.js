const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, "myscretkey");
    const user = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ err: "Please authenticate" });
  }
};

module.exports = auth;
