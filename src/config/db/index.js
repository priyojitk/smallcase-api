import mongoose from "mongoose";

const dev = process.env.NODE_ENV !== "production";
const dev_url = process.env.MONGO_URI_DEV;
const prod_url = process.env.MONGO_URI_PRODUCTION;
const url = dev ? dev_url : prod_url;
// mongoose.Promise = global.Promise;
// Connecting to the database
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((data) => {
    console.log("Successfully connected to the database");
    console.log("URI :", url);
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });
