import express from "express"
import db from "../db-sqlite.js"
import { authMiddleware } from "../server.js"

const router = express.Router()
//username
router.get("/", authMiddleware, async (req, res) => {
  
  const userId = req.session?.userId || 1
  const user = await db.get("SELECT name FROM user WHERE id = ?", userId)

  const tweets = await db.all(`
    SELECT tweet.*, user.name AS username, tweet.updated_at AS date
    FROM tweet
    JOIN user ON tweet.author_id = user.id
    ORDER BY updated_at DESC;
    ;`)

  tweets.forEach(tweet => {
    if (tweet.date) {
      tweet.date = new Date(tweet.date).toISOString();
    }
  });

  res.render("index.njk", {
    title: "Qvixter - All posts",
    tweets: tweets,
    activeUser: user ? user.name : null
  })
})

router.get("/new", authMiddleware, (req, res) => {
  res.render("new.njk", {
    title: "qvixter - new post"
  })
})



router.post("/new", authMiddleware, async (req, res ) =>{
  const message = req.body.message
 
  const author_id = req.session?.userId || 1
  const created_at = new Date().toISOString()
  await db.run("INSERT INTO tweet (message, author_id, created_at) VALUES (?, ?, ?)", message, author_id, created_at)
  res.redirect("/")

  console.log("here")
  
})









export default router
