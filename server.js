const express = require("express"); 
const app = express(); 
const bodyparser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
let router = require("./api/router");
const redis = require("redis");
const redisClient = redis.createClient();
redisClient.connect();
const  {cacheStart}  = require('./api/controller/emp');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use("/", router);

async function init() {
  try {
    await cacheStart()
    app.listen(process.env.PORT, () => {
    console.log(`Now listening on port ${process.env.PORT}`);
  });
  } catch(err) {
    console.log(err.message)
  }
}

init();