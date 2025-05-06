import express from "express"
import bcrypt from "bcrypt"
import pool from "../db.js"
import bodyParser from "body-parser"
import { compare } from "bcrypt"
import sqliteDb from "../db-sqlite.js"

const router = express.Router()

router.get("/", async (req, res) => {
  res.render("login.njk");
});


router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(req.body);
  const [rows] = await pool
    .promise()
    .query("SELECT * FROM user WHERE username = ?", [
      username
    ]);

  if (rows.length > 0) {
    const DATABASE_PASSWORD = rows[0].password;
    bcrypt.compare(password, DATABASE_PASSWORD).then(async function (result) {
      if (result) {
        console.log("Allt stämmer!");
        // Insert or find user in SQLite user table
        let sqliteUser = await sqliteDb.get("SELECT * FROM user WHERE name = ?", username);
        if (!sqliteUser) {
          const insertResult = await sqliteDb.run("INSERT INTO user (name) VALUES (?)", username);
          sqliteUser = { id: insertResult.lastID, name: username };
        }
        req.session.userId = sqliteUser.id; 
        res.redirect("/");
      } else {
        console.log("lösenord eller andvändarnamn hittas inte");
        return res.status(401).send("fel lösenord eller andvändarnamn");
      }
    });
  } else {
    console.log("lösenord eller andvändarnamn hittas inte");
    return res.status(401).send("fel lösenord eller andvändarnamn");
  }
});

export default router
