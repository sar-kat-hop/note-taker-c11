const express = require("express"); 
const path = require("path");
const api = require("../routes/index.js");

const PORT = process.env.PORT || 3001; //port config for use with heroku and locally for testing

const app = express();

//middleware for parsing json and url-encoded data
app.use(express.json()); 
app.use(express.urlencoded({extended: true }));
app.use("/api", api);

app.use(express.static("public"));

//serve landing page
  // app.get((req, res) => res.send(""));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/index.html"))
  );

//serve notes page
  app.get("/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "/notes.html"))
    );

//add port listening console msg
app.listen(PORT, () =>
  console.log(`Note Taker listening at http://localhost:${PORT}`)
  );
// app.listen(process.env.PORT);
