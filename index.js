const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const session = require("express-session")
require('dotenv').config();

app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        sameSite: 'strict'
    }
}))

const app_router = require("./routes/app_router")
const producer_router = require("./routes/producer_router")
const recycler_router = require("./routes/recycler_router")

const static_path = path.join(__dirname, "static")
app.use(express.static(static_path))

const views_path = path.join(__dirname, "templates/views")
app.set("view engine", "hbs")
app.set("views", views_path)

const partials_path = path.join(__dirname, "templates/partials")
hbs.registerPartials(partials_path)

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(app_router)
app.use(producer_router)
app.use(recycler_router)

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log("Server listening on port 5000... http://localhost:5000");
})