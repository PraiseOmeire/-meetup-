const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

//connecting mongo with mongoose to our app
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Mongoose connected...");
  } catch (error) {
    console.error(error.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
