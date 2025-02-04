const express = require("express");
const coookie = require('cookie-parser');

require('dotenv').config()

const path = require("path");
const app = express();
 
const port = 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(coookie());

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

//view
// app.get("/", (req, res) => {
//   console.log("get")
//   res.sendFile(path.join(__dirname, "views", "home.html"));
// });


app.listen( process.env.PORT || port, () => {
  console.log(`Sever is on Port:${port}！`);
});
