const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AuthRoute = require("./Routes/auth");
const UserRoute = require("./Routes/user");
const PostRoute = require("./Routes/Post");
const CategoryRoute = require("./Routes/Category");
const cors = require('cors');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_DEV_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("connected to db")
});

app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/post', PostRoute);
app.use('/api/category', CategoryRoute);

app.listen("5000", () => {
  console.log("Server up & Running at localhost:5000")
});