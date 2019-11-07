const express = require("express");
const router = express.Router();
const hello = require("./hello");
const mysql = require("mysql");
const { authMiddleware } = require("../utils/authMiddleware");

const db = mysql.createConnection({
  user: "stuser",
  password: "mypass",
  host: "localhost",
  database: "studentbook"
});

db.connect(err => {
  if (err) console.log("Cannot connect to DB");
  else console.log("Connected to DB");
});

const register = (req, res) => {
  const query =
    "INSERT INTO users(name, username, password, email, mobile, college) VALUES (?,?,?,?,?,?)";

  db.query(
    "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
    [req.body.username, req.body.email],
    (err, result, fields) => {
      if (err) {
        f = 0;
        console.log(err);
        return res.json({ status: "fail", msg: "something went wrong" });
      }

      if (result[0] != null) {
        f = 0;
        return res.json({
          status: "fail",
          msg: "User with similiar details already exists"
        });
      }
      db.query(query, [
        req.body.name,
        req.body.username,
        req.body.password,
        req.body.email,
        req.body.mobile,
        req.body.college,
        (err, result) => {
          if (err) {
            return res.json({ status: "fail", msg: "Something went wrong" });
          }
        }
      ]);
      res.json({ status: "Success", msg: "User added" });
    }
  );
};

const login = (req, res) => {
  const query = "SELECT * FROM users WHERE username = ? LIMIT 1";
  db.query(query, [req.body.username], (err, result, fields) => {
    if (err) {
      return res.json({ status: "fail", msg: "Something went wrong" });
    }

    if (result[0] == null) {
      return res.json({ status: "fail", msg: "User does not exist" });
    }

    if (result[0]["password"] == req.body.password) {
      req.session.username = req.body.username;
      return res.json({ status: "success", msg: "Logged in" });
    }
  });
};

const logout = (req, res) => {
  req.session.username = null;
  return res.json({ status: "success", msg: "Logged out" });
};

const addPost = (req, res) => {
  const query =
    "INSERT INTO post(title, content, type, username, votes, time) VALUES (?,?,?,?,?,?)";
  db.query(
    query,
    [
      req.body.title,
      req.body.content,
      req.body.type,
      req.session.username,
      0,
      Date.now()
    ],
    (err, result) => {
      if (err) return res.json({ status: "fail", msg: "Something went wrong" });
      return res, json({ status: "success", msg: "Post added." });
    }
  );
};

const addCommment = (req, res) => {
  const query =
    "INSERT INTO comments (username, content, postid) VALUES (?,?,?);";
  db.query(query, [req.session.username, req.body.content, req.body.postId]);
};

const upvote = (req, res) => {
  const query = "UPDATE post SET votes = votes + 1 WHERE id = ?";
  db.query(
    "SELECT * FROM posts WHERE postid = ?",
    [req.body.postId],
    (err, result) => {
      if (err) {
        return res.json({ status: "fail", msg: "Something went wrong" });
      }

      if (result[0] == null)
        return res.json({ status: "fail", msg: "Post does not exist anymore" });

      db.query(query, [req.body.postId], (err, result) => {
        if (err)
          return res.json({ status: "fail", msg: "Something went wrong" });
        return res.json({ status: "success", msg: "Post upvoted" });
      });
    }
  );
};

const downvote = (req, res) => {
  const query = "UPDATE post SET votes = votes - 1 WHERE id = ?";
  db.query(
    "SELECT * FROM posts WHERE postid = ?",
    [req.body.postId],
    (err, result) => {
      if (err) {
        return res.json({ status: "fail", msg: "Something went wrong" });
      }

      if (result[0] == null)
        return res.json({ status: "fail", msg: "Post does not exist anymore" });

      db.query(query, [req.body.postId], (err, result) => {
        if (err)
          return res.json({ status: "fail", msg: "Something went wrong" });
        return res.json({ status: "success", msg: "Post upvoted" });
      });
    }
  );
};

const getPostByType = (req, res) => {
  var query = "SELECT * FROM posts WHERE type = ?";
  db.query(query, [req.body.type], (err, result) => {
    if (err) {
      return res.json({ status: "fail", msg: "Something went wrong" });
    }
    if (result[0] == null)
      return res.json({ status: "success", msg: "No posts available" });
    return res.json({ status: "success", msg: "Posts sent", data: result });
  });
};

router.get("/", authMiddleware, hello);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

router.post("/addPost", authMiddleware, addPost);
router.post("/addComment", authMiddleware, addComment);
router.post("/upvote", authMiddleware, upvote);
router.post("/downvote", authMiddleware, downvote);

module.exports = router;
