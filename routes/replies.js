import express from "express"
import { body, validationResult, matchedData } from "express-validator"
import db from "../db-sqlite.js"
import { authMiddleware } from "../server.js"

const router = express.Router()

// Get replies för tweet
router.get("/:tweetId", async (req, res) => {
  const tweetId = req.params.tweetId
  if (!Number.isInteger(Number(tweetId))) {
    return res.status(400).send("Invalid tweet ID")
  }//
  const replies = await db.all(`
    SELECT reply.*, user.name AS username
    FROM reply
    JOIN user ON reply.author_id = user.id
    WHERE reply.tweet_id = ?
    ORDER BY reply.created_at ASC
  `, tweetId)
  res.json(replies)
})

// Post reply till tweet
router.post("/",
  authMiddleware,
  body("tweet_id").isInt(),
  body("message").isLength({ min: 1, max: 130 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid input")
    }
    const { tweet_id, message } = matchedData(req)
    const author_id = req.session.userId
    const created_at = new Date().toISOString()
    await db.run(`
      INSERT INTO reply (tweet_id, message, author_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `, tweet_id, message, author_id, created_at, created_at)
    res.json({ success: true })
  })

export default router
