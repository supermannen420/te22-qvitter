import express from "express"
import bcrypt from "bcrypt"
import db from "../db-sqlite.js"
import bodyParser from "body-parser"

const router = express.Router()

router.get("/", async (req, res) => {
  res.render("register.njk", { title: "Register" });
});

router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Check if user already exists
    const existingUser = await db.get("SELECT * FROM user WHERE name = ?", username);
    if (existingUser) {
      return res.status(400).send("Username already taken");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.run("INSERT INTO user (name, password) VALUES (?, ?)", username, hashedPassword);

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});

export default router;
