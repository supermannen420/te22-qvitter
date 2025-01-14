import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"

const app = express()
const port = 3000

nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.use(express.static("public"))

app.get("/", (req, res) => {
  res.render("index.njk",
    { title: "Qvixter", message: "Best service, legit." }
  )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})