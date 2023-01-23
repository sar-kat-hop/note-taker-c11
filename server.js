const express = require("express"); 
const path = require("path");

const PORT = process.env.PORT || 3001; //port config for use with heroku and locally for testing

//import route for /notes
const notesRouter = require("./routes/notes");

const app = express();

app.use("/notes", notesRouter);
app.use("/api", api);

//middleware for parsing json and url-encoded data
app.use(express.json()); 
app.use(express.urlencoded({extended: true }));

app.use(express.static("public"));

//serve landing page
  // app.get((req, res) => res.send(""));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
  );

//serve notes page
  app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "/public/notes.html"))
    );

//add port listening console msg
app.listen(PORT, () =>
  console.log(`Note Taker listening at http://localhost:${PORT}`)
  );
// app.listen(process.env.PORT);

module.exports = app;