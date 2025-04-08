import express from "express"
import { body, validationResult, matchedData } from "express-validator"
import db from "../db-sqlite.js"

const router = express.Router()

router.get("/:id/delete", async (req, res) => {
  
  const id = req.params.id

  if (!Number.isInteger(Number(id))){
    return res.status(400).send("Invalid ID")
  }
  await db.run("DELETE FROM tweet WHERE id = ?", id)
    res.redirect("/")
})

router.post("/delete",
  body("id").isInt(),
  async (req, res) => {
      // https://express-validator.github.io/docs/
      // validation chain och sanitization chain, express validator är en middleware
      // tvätta och validera input
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
          return res.status(400).send("Invalid ID")
      }

      const id = matchedData(req).id
      // parameterized query för att förhindra SQL injection
      await db.run("DELETE FROM tweet WHERE id = ?", id)
      res.redirect("/")
  })

router.get("/:id/edit", async (req, res) => {
  const id = req.params.id
  if (!Number.isInteger(Number(id))) { return res.status(400).send("Invalid ID") }
  const rows = await db.get("SELECT * FROM tweet WHERE id = ? LIMIT 1", id)
  console.log(rows)
  if (rows.length === 0) {
      return res.status(404).send("Tweet not found")
  }
  res.render("edit.njk", { tweet: rows })
})

router.post("/edit",
  body("id").isInt(),
  body("message").isLength({ min: 1, max: 130 }),
  body("message").escape(),
  async (req, res) => {
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) { return res.status(400).send("Invalid input") }

  const { id, message } = matchedData(req) // req.params.message varför inte?
  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ")
  console.log(timestamp)
  await db.run("UPDATE tweet SET message = ?, updated_at = ? WHERE id = ?", message, timestamp, id)
        res.redirect("/")
})



export default router
