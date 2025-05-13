import express from "express";
import bcrypt from "bcrypt";
import db from "../db-sqlite.js";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.render("login.njk");
});

router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const user = await db.get("SELECT * FROM user WHERE name = ?", username);
    if (!user || !user.password) {
      console.log("Username or password not found");
      return res.status(401).send("Invalid username or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Username or password not found");
      return res.status(401).send("Invalid username or password");
    }

    req.session.userId = user.id;
    console.log("Login successful, redirecting...");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

export default router;
