import express from "express"
import bcrypt from "bcrypt"
import pool from "../db.js"
import bodyParser from "body-parser"
import { compare } from "bcrypt"


const router = express.Router()





router.get("/", async(req, res) => {
    res.render("login.njk")
  })
  
router.get("/logedin", (req, res) => {
    if (!req.session.user) {
      return res.redirect("/"); // Skicka tillbaka till login om inte inloggad
    }
    res.render("logedin.njk", { titel: "Inloggad", message: "Du är inloggad" });
  });
  
  
  
  
  router.post("/", async(req,res) => {
    const username = req.body.username
    const password = req.body.password
  
    console.log(req.body)
    const [rows] = await pool
    .promise()
      .query("SELECT * FROM user WHERE username = ?", [ 
        username
      ]);
    
  
    
    if (rows.length > 0) {
      const DATABASE_PASSWORD = rows[0].password;
      bcrypt.compare(password, DATABASE_PASSWORD).then(function(result) {
        if (result) {
          console.log("Allt stämmer!") 
          req.session.user = username;
          res.redirect("/login/logedin")
        }else {
            console.log("lösenord eller andvändarnamn hittas inte");
            return res.status(401).send("fel lösenord eller andvändarnamn");
            
        }
         
      });
    } else {
      console.log("lösenord eller andvändarnamn hittas inte");
      return res.status(401).send("fel lösenord eller andvändarnamn");

    }
  })
  
  
  export default router;