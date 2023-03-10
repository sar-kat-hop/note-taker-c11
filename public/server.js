const express = require("express"); 
const path = require("path");
const noteData = require("./db.json");

const PORT = process.env.PORT || 3001; //port config for use with heroku and locally for testing

//import route for /notes
const notesRouter = require("./routes/notes");

const app = express();

app.use("/api/notes", notesRouter);
// app.use("/api", api);

//middleware for parsing json and url-encoded data
app.use(express.json()); 
app.use(express.urlencoded({extended: true }));

app.use(express.static("public"));

//time logger
  app.use((req, res, next) => {
    console.log("new request received at " + Date.today());
      next();
  });

//GET all notes
  app.get("/api/notes", (req, res) => res.json(noteData));

//serve landing page
  // app.get((req, res) => res.send(""));
  app.get("/api", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html")),
      console.info(`GET /index.html`);
      res.status(200).json(index);
  });

//serve notes page
  app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "notes.html")),
      console.info(`GET /api/notes`);
      res.status(200).json(notes);
  });

//add port listening console msg
  app.listen(PORT, () =>
    console.log(`Note Taker listening at http://localhost:${PORT}`)
    );
// app.listen(process.env.PORT);

module.exports = app;