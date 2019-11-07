const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const session = require("express-session");

const app = express();

const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "studentbookkey",
    saveUninitialized: false,
    cookie: { maxAge: 86400 }
  })
);
app.use("/api", router);

app.listen(PORT, err => {
  if (err) console.log("Error creating connection:" + err);
  else console.log("Listening on:" + PORT);
});
