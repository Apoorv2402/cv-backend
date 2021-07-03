const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AuthRoute = require("./Routes/auth")
const UserRoute = require("./Routes/user")
const PostRoute = require("./Routes/Post")
dotenv.config();

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


app.listen("5000", () => {
  console.log("Server up & Running")
})