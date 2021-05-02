const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const connectDB = async () => {
  try {
    //Always try to use Async await witchin a try catch
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }); //mongoose.connect() returns a promise so using a await can also use .then etc but this looks like a synchronous way although it is asynchronous
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    //Exits process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
