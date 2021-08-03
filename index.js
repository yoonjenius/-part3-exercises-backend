require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { request, response } = require("express");
const morgan = require("morgan");
const { json } = require("body-parser");
const Person = require("./models/person");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(bodyParser.urlencoded({ extended: true }));

morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
//   {
//     id: 5,
//     name: "Yoonji Lee",
//     number: "010-3048-1206",
//   },
// ];

app.get("/info", (request, response) => {
  response.write(
    "<h1>Phonebook has info for " + persons.length + " peopel.</h1>"
  );
  response.write("<h1>" + new Date().toISOString() + "</h1>");
  response.end();
});

app.get("/api/persons", (request, response) => {
  //response.json(persons);
  Person.find({}).then((result) => {
    //  console.log("get method: ", result);
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // console.log(id);
  // const person = persons.find(person => person.id === id);
  // if(!person){
  //     response.status(404).end();
  // }else{
  //     response.json(result);
  // }
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      // console.log("/api/persons/:id of get: ", error);
      // response.status(500).end(); //500 internal server error
      // response.status(500).send({ error: "malformatted id" });
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // persons = persons.filter(person => person.id !== id);
  // console.log(persons);
  // response.status(404).end();
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const personObject = {
    name: request.body.name,
    number: request.body.number,
  };
  Person.findByIdAndUpdate(request.params.id, personObject, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

// const generateId = () => {
//     const maxId = persons.length > 0 ? Math.max(...persons.map(n=> n.id)) : 0;
//     return maxId+1;
// }

app.post("/api/persons", (request, response, next) => {
  // const personObject = {
  //     id: generateId(),
  //     name: request.body.name,
  //     number: request.body.number
  // }

  // if(!request.body.name || !request.body.number){
  //     return response.json({error:'You missed a name or a number'});
  // }else if(Person.find({name: request.body.name})){
  // //else if(persons.find(person => person.name === request.body.name)){
  //     return response.json({ error: 'name must be unique' });
  // }
  // console.log("request.headers from Post", request.headers);
  // persons = persons.concat(personObject);
  // response.json(personObject);
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  // person.save().then(result =>{
  //     response.json(result);
  // }).catch(error => next(error));
  person
    .save()
    .then((result) => result.toJSON())
    .then((savedAndFormattedResult) => {
      response.json(savedAndFormattedResult);
    })
    .catch((error) => {
      next(error);
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknwn endPoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    //if error is a CastError exception,
    //Mongo에서 유효하지 않은 오브젝트의 id를 불러와서 생긴 오류
    //console.log("CastError");
    return response.status(404).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
