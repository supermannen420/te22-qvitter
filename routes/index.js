import express from "express"
import pool from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const [tweets] = await pool.promise().query(`
    SELECT tweet.*, user.name
    FROM tweet
    JOIN user ON tweet.author_id = user.id;`)

  res.render("index.njk", {
    title: "Qvixter",
    message: "Message from routes/index.js",
    tweets: tweets,
  })
})

export default router