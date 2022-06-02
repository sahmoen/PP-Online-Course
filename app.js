const express = require('express')
const session = require('express-session')
const Controller = require('./controllers/controller')
const app = express()
const port = process.env.PORT ||3000

app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(session({
  secret: 'yang tau aja', //untuk mengamankan session kita (wajib ada)
  resave: false, //perubahan email / name dri user tidak di simpan
  saveUninitialized: false, 
  cookie: { 
    secure: false,
    sameSite: true 
  }
}))
app.use("/register", require("./routes/register"))
app.use("/", require("./routes/index"))
app.use("/home", require("./routes/home"))


app.use("/login", require("./routes/login"))
app.use("/logout", require("./routes/logout"))
app.use("/register", require("./routes/register"))

app.get('/logout', Controller.logOutSesi)

app.listen(port, () => {
  console.log(`this app listening on port ${port}`)
})