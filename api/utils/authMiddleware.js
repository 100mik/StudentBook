const authMiddleware = (req, res, next) => {
  if (req.session.username) {
    return next();
  } else {
    return res.json({ status: "fail", msg: "Login required" });
  }
};

module.exports = { authMiddleware };
