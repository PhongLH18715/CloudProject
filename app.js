const express = require("express");
const engines = require("consolidate");
const app = express();

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

let publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

// npm i handlebars consolidate --save
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

let productsManager = require("./manageProduct.js");
app.use("/", productsManager);
app.get("/", async (req,res) => {
  res.redirect("/home");
})
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running in 3000 port");
});
