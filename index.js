import Connection from "./src/database/db.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// const jwt = require('jsonwebtoken');

import Routes from "./src/routes/route.js";

const port = process.env.PORT || 3000;

const app = express();
// app.use(bodyParser.json());
dotenv.config();

app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", Routes);

const MONGOURL = process.env.MONGO_URL;

Connection(MONGOURL).then((res) => {
  console.log(res);
  if (res === "success") {
    app.listen(port || process.env.PORT, () =>
      console.log(`Server is running on PORT ${port}`)
    );
  }
});
