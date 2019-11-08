const express = require("express");
const router = express.Router();
const hello = require("./hello");
const mysql = require("mysql");
const { authMiddleware } = require("../utils/authMiddleware");
const multer = require("multer");
const uuid = require("uuid/v4");
const mime = require("mime");

const uploadBasePath = "./statics";
var currentUser = "";

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

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./statics");
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + file.originalname + ".jpeg");
  }
});

const postImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./statics");
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + file.originalname + ".jpeg");
  }
});

const imgUpload = multer({ storage: imageStorage });
const postImgUpload = multer({ storage: postImageStorage });

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
      currentUser = req.body.username;
      return res.json({ status: "success", msg: "Logged in" });
    }
  });
};

const logout = (req, res) => {
  req.session.username = null;
  currentUser = "";
  return res.json({ status: "success", msg: "Logged out" });
};

const addPost = (req, res) => {
  const query =
    "INSERT INTO posts (title, content, type, username, votes, time) VALUES (?,?,?,?,?,?)";

  var time = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  db.query(
    query,
    [
      req.body.title,
      req.body.content,
      req.body.type,
      req.session.username,
      0,
      time
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ status: "fail", msg: "Something went wrong" });
      }
      return res.json({ status: "success", msg: "Post added." });
    }
  );
};

const addComment = (req, res) => {
  const query =
    "INSERT INTO comments (username, content, postid) VALUES (?,?,?);";
  db.query(
    query,
    [req.session.username, req.body.content, req.body.postId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ status: "fail", msg: "Something went wrong" });
      }

      return res.json({
        status: "success",
        data: result,
        msg: "Comments listed"
      });
    }
  );
};

const getComments = (req, res) => {
  const query = "SELECT * FROM comments WHERE postid = ?";

  db.query(query, [req.params.id], (err, result, fields) => {
    if (err) {
      console.log(err);
      return res.json({ status: "fail", msg: "Something went wrong" });
    }

    if (result[0] == null) {
      return res.json({
        status: "fail",
        message: "comments not found for post"
      });
    }
    return res.json({ status: "success", msg: "comments found", data: result });
  });
};

const upvote = (req, res) => {
  const query = "UPDATE posts SET votes = votes + 1 WHERE id = ?";
  db.query(
    "SELECT * FROM posts WHERE id = ?",
    [req.body.postId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ status: "fail", msg: "Something went wrong" });
      }

      if (result[0] == null)
        return res.json({ status: "fail", msg: "Post does not exist anymore" });

      db.query(query, [req.body.postId], (err, result) => {
        if (err) {
          console.log(err);
          return res.json({ status: "fail", msg: "Something went wrong" });
        }
        return res.json({ status: "success", msg: "Post upvoted" });
      });
    }
  );
};

const downvote = (req, res) => {
  const query = "UPDATE posts SET votes = votes - 1 WHERE id = ?";
  db.query(
    "SELECT * FROM posts WHERE id = ?",
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
        return res.json({ status: "success", msg: "Post downvoted" });
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

const follow = (req, res) => {
  const query = "INSERT INTO follows(username, type) VALUES (?,?)";
  db.query(query, [req.session.username, req.body.type], (err, result) => {
    if (err) {
      return res.json({ status: "fail", msg: "Something went wrong" });
    }
    return res.json({ status: "success", msg: "Topic followed" });
  });
};

const getPostsForUser = (req, res) => {
  const query =
    "SELECT * FROM posts WHERE type IN (SELECT type FROM follows WHERE username = ?)";

  db.query(query, [req.session.username], (err, results, fields) => {
    if (err) {
      return res.json({ status: "fail", msg: "Something went wrong" });
    }
    if (results[0] == null) {
      return res.json({ status: "success", msg: "No posts to show" });
    }

    return res.json({ status: "success", msg: "Post sent", data: results });
  });
};

const addPostImage = (req, res) => {
  const query = "UPDATE posts SET imagepath = ? WHERE id = ?";

  db.query(query, [req.file.filename, req.params.id], (err, result) => {
    if (err) {
      return res.json({ status: "fail", msg: "Something went wrong" });
    }

    if (result.rowsAffected == 0) {
      return res.json({ status: "fail", msg: "Post not found" });
    }

    return res.json({ status: "success", msg: "Image uploaded" });
  });
};

const addProfileImage = (req, res) => {
  const query = "INSERT INTO profile_pictures VALUES (?,?)";
  const query2 = "UPDATE profile_pictures SET imagepath = ? WHERE username = ?";

  db.query(
    "SELECT * FROM profile_pictures WHERE username = ?",
    [req.session.username],
    (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.json({ status: "fail", msg: "Something went wrong" });
      }

      if (results[0] == null) {
        db.query(
          query,
          [req.session.username, req.file.filename],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.json({ status: "fail", msg: "Something went wrong" });
            }

            return res.json({ status: "success", msg: "Image uploaded" });
          }
        );
      } else {
        db.query(
          query2,
          [req.file.filename, req.session.username],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.json({ status: "fail", msg: "Something went wrong" });
            }

            return res.json({ status: "success", msg: "Image uploaded" });
          }
        );
      }
    }
  );
};

const getProfileImage = (req, res) => {
  const query =
    "SELECT imagepath FROM profile_pictures WHERE username = ? LIMIT 1";

  db.query(query, [req.session.username], (err, results, field) => {
    if (err) {
      return res.json({ status: "fail", msg: "Something went wrong" });
    }

    if (results[0] == null) {
      return res.json({ status: "fail", msg: "Image not found" });
    }

    res.json({
      status: "success",
      msg: "Image found",
      data: results[0]["imagepath"]
    });
  });
};

const getPostImage = (req, res) => {
  const query = "SELECT imagepath FROM posts WHERE id = ? LIMIT 1";

  db.query(query, [req.params.id], (err, results, field) => {
    if (err) {
      return res.json({ status: "fail", msg: "Something went wrong" });
    }

    if (results[0] == null) {
      return res.json({ status: "fail", msg: "Image not found" });
    }

    res.json({
      status: "success",
      msg: "Image found",
      data: results[0]["imagepath"]
    });
  });
};

router.get("/", authMiddleware, hello);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

router.post("/addPost", authMiddleware, addPost);
router.post("/addComment", authMiddleware, addComment);
router.get("/getComments/:id", authMiddleware, getComments);
router.post("/upvote", authMiddleware, upvote);
router.post("/downvote", authMiddleware, downvote);
router.get("/getPostByType", authMiddleware, getPostByType);
router.post("/follow", authMiddleware, follow);
router.get("/getPostsForUser", authMiddleware, getPostsForUser);

router.post(
  "/addPostImage/:id",
  authMiddleware,
  postImgUpload.single("image"),
  addPostImage
);
router.post(
  "/addProfileImage",
  authMiddleware,
  imgUpload.single("image"),
  addProfileImage
);

router.get("/getProfileImage", authMiddleware, getProfileImage);
router.get("/getPostImage/:id", authMiddleware, getPostImage);

module.exports = { router, currentUser };
