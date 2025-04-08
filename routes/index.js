import express from "express"
import db from "../db-sqlite.js"


const router = express.Router()
//username
router.get("/", async (req, res) => {
    const tweets = await db.all(`
    SELECT tweet.*, user.name
    FROM tweet
    JOIN user ON tweet.author_id = user.id
    ORDER BY updated_at DESC;
    ;`)

     // Format the dates on the backend
    

  res.render("index.njk", {
    title: "Qvixter - All posts",
    //message: "Message from routes/index.js",
    tweets: tweets,
  })
})

router.get("/new", (req, res) => {
  res.render("new.njk", {
    title: "qvixter - new post"
  })
})

router.post("/new", async (req, res ) =>{
  const message = req.body.message
    const author_id = 1
    await db.run("INSERT INTO tweet (message, author_id) VALUES (?, ?)", message, author_id)
    res.redirect("/")

  console.log("here")
  
})









export default router