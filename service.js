const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "dbconfig.env" });

const app = express();
var corsOptions = {
  origin: "*",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

const routes = require("./router/route");
app.use("/", routes);

const db = require("./model");

db.mongoose
  .connect(
    `mongodb://${process.env.HOST}:${process.env.PORT}/${process.env.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.listen(1229, () =>
  console.log("App is listening on url http://localhost:1229")
);
