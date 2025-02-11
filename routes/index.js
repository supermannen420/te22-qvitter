import express from "express"
import pool from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const [tweets] = await pool.promise().query(`
    SELECT tweet.*, user.name, DATE_FORMAT(tweet.updated_at, "%Y-%m-%d %H:%i") AS date
    FROM tweet
    JOIN user ON tweet.author_id = user.id
    ORDER BY updated_at DESC;`)

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
  const message = req.body.message;
  const author_id = req.body.author_id;

  try {
    await pool.
    promise().
    query("INSERT INTO tweet(author_id, message) VALUES(?, ?)", [ 
      author_id,
      message
    ])
  } catch (e) {
    console.error("failed to create new tweet", e);
  }
  res.redirect("/")

  console.log("here")

})




export default router