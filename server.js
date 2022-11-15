const express = require("express"); 
const app = express(); 
const bodyparser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
let router = require("./api/router");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
async function init() {
  try {
    app.use("/", router);
    app.listen(process.env.PORT, () => {
    console.log(`Now listening on port ${process.env.PORT}`);
  });
  } catch(err) {
    console.log(err.message)
  }
}
init();