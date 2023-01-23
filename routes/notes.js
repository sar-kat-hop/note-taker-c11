// const express = require("express");
const notes = require("express").Router();
const {readFromFile, readAndAppend } = require("/utilities/fsUtils");
const uuid = require("/utilities/uuid"); 
// app.use("/api", api);
// app.use("", notesRouter);
// module.exports = app;

//GET request to retrieve notes
app.get("/", (req, res) => {
    res.json(`${req.method} request to get notes received (GET success)`);

    readFromFile("./db/db.json")
        .then((data) => res.json(JSON.parse(data)));
    });

//POST request to add note
app.post("/", (req, res) => {
    console.info(`${req.method} request to add note received (POST success)`);

    const { title, text } = req.body;
        if (title && text) {
            const newNote = {
                title,
                text,
                note_id: uuid(),
            };

            readAndAppend(newNote, "../db/db.json");

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

    module.exports = notes;
