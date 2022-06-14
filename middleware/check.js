const jwt = require("jsonwebtoken");
const db = require("../model");
require("dotenv").config({ path: "../dbconfig.env" });

module.exports.checkToken = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "no token provided",
    });
  }

  try {
    const secret = process.env.SECRET || "secret";
    const { email } = jwt.verify(token, secret);
    const result = await db.User.findOne({ email: email });

    if (result) {
      req.user = result;

      return next();
    } else {
      return res.status(401).json({
        success: false,
        message: "no user found",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
};
