const express = require("express"); //import express
const path = require("path");
const uuid = require("../utilities/uuid"); //utility for generating ids for notes
const noteData = require("../db/db.json"); //require db.json file 
const fs = require("fs");

const PORT = 3001; //set port for deployment

const app = express(); //initialize app var by setting it to = express()

app.use(express.json());
//prep express to parse data
app.use(express.urlencoded({extended: true }));

app.use(express.static("public"));

//TODO: see if code below is approp for routing pages...?

  //serve landing page ("home"; since this pg is static, approp to create indiv route? 
    // app.get("/home", (req, res) => 
    //   res.sendFile(path.join(__dirname, "./public/index.html"))
    //   );

  //alternative to above:
    app.get("/", (req, res) =>
      res.sendFile(path.join(__dirname, "./public/index.html"))
      );

  // app.get((req, res) => res.send(""));

//return notes in JSON
// app.get("/api", (req, res) => res.json(noteData));

//GET request for notes
app.get("/api/notes", (req, res) => {
  //notify client
  res.json(`${req.method} request to get notes received (GET success)`);
  // res.json(noteData);
});

//POST request to add note
app.post("api/notes", (req, res) => {
  //console log confirming request rec'd
  console.info(`${rew.method} request to add note received (POST success)`);

  const { title, text, note_id } = req.body;
    if (title && text && note_id) {
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };

  //Is this needed?
    //convert to string to save
    const noteString = JSON.stringify(newNote);

    //write string to db.json and catch error if applicable
    fs.writeFile(`./db/db.json`, noteString, (err) => 
      err
        ? console.error(err)
        : console.info(`New note with ID ${note_id} has been written to db.json.`)
        );

    const response = {
      status: "success",
      body: newNote,
      };  
  
    console.log(response);
    res.status(201).json(response);

    } else {
      res.status(500).json("Error: could not post note.");
    }
  });

//add port listening console msg
app.listen(PORT, () =>
  console.log(`Note Taker listening at http://localhost:${PORT}`)
);