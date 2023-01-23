const express = require("express"); //import express
const path = require("path");
const uuid = require("../utilities/uuid"); //utility for generating ids for notes
// const noteData = require("../db/db.json"); //require db.json file 
const fs = require("fs");
const { networkInterfaces } = require("os");

const PORT = 3001; //set port for deployment

const app = express(); //initialize app var by setting it to = express()

app.use(express.json());
//prep express to parse data

app.use(express.urlencoded({extended: true }));

app.use(express.static("public"));

//serve landing page
// app.get((req, res) => res.send(""));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./index.html"))
  );

//serve notes page
  app.get("/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "/public/notes.html"))
    );

//GET request to retrieve notes
app.get("/api/notes", (req, res) => {
  res.json(`${req.method} request to get notes received (GET success)`);
  readFromFile("./db/db.json")
    .then((data) => res.json(JSON.parse(data)));
  // res.render("notes.html");
  // res.json(noteData);
});

//POST request to add note
app.post("/api/notes", (req, res) => {
  //console log confirming request rec'd
  console.info(`${req.method} request to add note received (POST success)`);

  const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };

      readAndAppend(newNote, "./db/db.json");

      const response = {
        status: "Success",
        body: newNote,
      };

        console.log(response);
        // res.status(201).json(response);
        res.json("New note added.");

    } else {
        res.error("Error: could not add tip.");
        // res.status(500).json("Error");
    };

    //write string to db.json and catch error if applicable
    // fs.writeFile(`./db/db.json`, noteString, (err) => 
    //   err
    //     ? console.error(err)
    //     : console.info(`New note with ID ${note_id} has been written to db.json.`)
    //     );

    // const response = {
    //   status: "success",
    //   body: newNote,
    //   };  
  
    // console.log(response);
    // res.status(201).json(response);

    // } else {
    //   res.status(500).json("Error: could not post note.");
    // }
  });

//add port listening console msg
app.listen(process.env.PORT, () =>
  console.log(`Note Taker listening at http://localhost:${PORT}`)
  );
// app.listen(process.env.PORT);
