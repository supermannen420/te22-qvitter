import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import logger from "morgan"
import morgan from "morgan"
import bcrypt from "bcrypt"
import session from "express-session"
import bodyParser from "body-parser"

import indexRouter from "./routes/index.js"
import tweetsRouter from "./routes/tweets.js"
import loginRouter from "./routes/login.js"
import registerRouter from "./routes/register.js"

const app = express()
const port = 3000

nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(logger("dev"))
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}))

app.use("/", indexRouter)
app.use("/tweets", tweetsRouter)
app.use("/login", loginRouter)
app.use("/register", registerRouter)


// Authentication middleware to protect routes
export function authMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

// Redirect /logedin to /login/logedin for backwards compatibility
app.get("/logedin", (req, res) => {
  res.redirect("/login/logedin")
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

let myPlaintextPassword = "detlösenordsomduvillha"
bcrypt.hash(myPlaintextPassword, 10, function(err, hash) {
	// här får vi nu tag i lösenordets hash i variabeln hash
	console.log(hash)
})