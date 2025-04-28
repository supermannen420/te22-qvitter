import express from "express"
import bcrypt from "bcrypt"
import pool from "../db.js"
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
    const [existingUsers] = await pool.promise().query("SELECT * FROM user WHERE username = ?", [username]);
    if (existingUsers.length > 0) {
      return res.status(400).send("Username already taken");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.promise().query("INSERT INTO user (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});

export default router;
