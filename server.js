const express = require("express"); //import express
const path = require("path");
const uuid = require(""); //utility for generating ids for notes
const noteData = require(""); //require db.json file 

const PORT = 3001; //set port for deployment

const app = express(); //initialize app var by setting it to = express()

app.use(express.json());
//prep express to parse data
app.use(express.urlencoded({extended: true }));

app.use(express.static("public"));

//TODO: see if code below is approp for routing pages...?

  //serve landing page ("home"; since this pg is static, approp to create indiv route? 
    app.get("/home", (req, res) => 
      res.sendFile(path.join(__dirname, "/public/index.html"))
      );

  //alternative to above:
    app.get("/", (req, res) =>
      res.sendFile(path.join(__dirname, "/public/index/html"))
      );

  // //serve notes page
    // app.get("/myNotes", (req, res) => 
    //   res.sendFile(path.join(__dirname, "/public/notes.html"))
    // );

  // app.get((req, res) => res.send(""));

//return notes in JSON
app.get("/api", (req, res) => res.json(noteData));

app.listen(PORT, () => 
  console.log(`App listening at http://localhost:${PORT}`)
  );