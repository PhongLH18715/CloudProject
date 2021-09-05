const express = require("express");
var router = express.Router();

let MongoClient = require("mongodb").MongoClient;
let url =
  "mongodb+srv://leehongphong:phongshop@phongshop.beqqb.mongodb.net/PhongDB?retryWrites=true&w=majority";

router.get("/home", async (req, res) => {
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("PhongDB");
  let result = await dbo.collection("Product").find({}).toArray();
  res.render("index", { model: result });
});

router.get("/insert", (req, res) => {
  res.render("insertProducts");
});

router.post("/doInsert", async (req, res) => {
  let inputID = req.body.txtID;
  let inputName = req.body.txtName;
  let inputPrice = req.body.txtPrice;
  let inputProducer = req.body.txtProducer;
  let inputImage = req.body.txtImage;
  let date = new Date();
  let addedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  let newProduct = {
    id: inputID,
    name: inputName,
    price: inputPrice,
    producer: inputProducer,
    image: inputImage,
    added: addedDate
  };

  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("PhongDB");

  if (Number.isNaN(inputPrice) || inputProducer.length > 3) {
    let errorModel = { errorMsg: "The price must be a number and Producer must less than 4 characters !!!" };
    res.render("insertProducts", { model: errorModel });
  } else {
    await dbo.collection("Product").insertOne(newProduct);
    res.redirect("/home");
  }
});

router.get("/doSearch", async (req, res) => {
  let name_search = req.query.txtSearch;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("PhongDB");
  //let search = /name_search$/;
  let result = await dbo
    .collection("Product")
    .find({
      $or: [
        { name: new RegExp(name_search, "i") },
        { producer: new RegExp(name_search, "i") },
      ],
    })
    .toArray();
  res.render("index", { model: result });
});

router.get("/remove", async (req, res) => {
  let id = req.query.id;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  var ObjectID = require("mongodb").ObjectID;
  let dbo = client.db("PhongDB");
  await dbo.collection("Product").deleteOne({ _id: ObjectID(id) });
  res.redirect("/home");
});

router.get("/update", async (req, res) => {
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("PhongDB");
  let result = await dbo.collection("Product").findOne({ _id: ObjectID(id) });
  res.render("updateProduct", { Product: result });
});

router.post("/doUpdate", async (req, res) => {
  let id = req.body.id;
  let inputID = req.body.txtID;
  let inputName = req.body.txtName;
  let inputPrice = req.body.txtPrice;
  let inputProducer = req.body.txtProducer;
  let inputImage = req.body.txtImage;
  let newValues = {
    $set: {
      id: inputID,
      name: inputName,
      price: inputPrice,
      producer: inputProducer,
      image: inputImage
    },
  };
  var ObjectID = require("mongodb").ObjectID;
  let condition = { _id: ObjectID(id) };

  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("PhongDB");
  await dbo.collection("Product").updateOne(condition, newValues);

  res.redirect("/home");
});

module.exports = router;
