const mongoose = require("mongoose");

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      //   useCreateIndex: true,
    });
    // console.log("Mongo DB connected: ", con);
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

module.exports = connectDB;
