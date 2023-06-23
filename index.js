const connectToMongo = require("./database");
const express = require("express");

var cors = require("cors");



const app = express();
var bodyParser = require('body-parser');

app.use(cors());
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("devray 1");
});

app.use(express.json({limit : '50mb',extended : true}))
app.use(express.urlencoded({limit : '50mb',extended : true}))

app.use("/auth", require("./routes.js"));

connectToMongo();

app.use(bodyParser.json());
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
