const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/phonebook", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// const person1 = new Person({
//     name: "Arto Hellas",
//     number: "040-123456",
// });
// const person2 = new Person({
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
// });
// const person3 = new Person({
//     name: "Dan Abramov",
//     number: "12-43-234345",
// });
// const person4 = new Person({
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
// });
// const person5 = new Person({
//     name: "JungKook Jeon",
//     number: "010-1997-0901",
// });
// person1.save().then(result => {
//     console.log("result", result);
// });
// person2.save().then(result => {
//     console.log("result", result);
// });
// person3.save().then(result => {
//     console.log("result", result);
// });
// person4.save().then(result => {
//     console.log("result", result);
// });
// person5.save().then(result => {
//     console.log("result", result);
// });

const commandInput = process.argv.map((val, index) => {
  console.log(`${index}: ${val}`);
  return val;
});

console.log(commandInput);

if (commandInput.length > 3) {
  const person = new Person({
    name: commandInput[3],
    number: commandInput[4],
  });
  person.save().then((result) => {
    //console.log("result", result);
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    });
}
