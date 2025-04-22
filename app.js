const express = require("express");
const session = require("express-session");
var passport = require("passport");
const path = require("node:path");
require("dotenv").config();
const pool = require("./db/pool");
const app = express();
const { indexRouter } = require("./routes/indexRouter");
const flash = require("connect-flash");

const pgSession = require("connect-pg-simple")(session);

app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SECRET,
    resave: false, // Don't resave the session if it hasn't been modified
    saveUninitialized: true, // Save session even if it is uninitialized
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});
app.use("/", indexRouter);

const PORT = process.env.PORT;

app.listen(3000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
