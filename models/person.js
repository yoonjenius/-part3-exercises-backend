const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;
console.log("connecting to ", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongDB: ", error.message);
  });

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });
//아예 스키마에서부터 유효성 검사를 할 수 있도록 설정함.
const personSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true, minLength: 3},
    number: {type: String, required: true, unique: true, minLength: 8},
});
personSchema.plugin(uniqueValidator, { message: `Error, expected {PATH} to be unique. Value : {VALUE}` });


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
