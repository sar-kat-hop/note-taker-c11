const express = require("express"); //import express
const path = require("path");
const uuid = require("/Develop/helpers/uuid.js"); //utility for generating ids for notes
const noteData = require("/Develop/db/db.json"); //require db.json file 

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

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

//moved get & post code up
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

//dynamically generated html
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  if (title && text) { //execute only if title & text have content
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
      note_id: uuid(), //add randomly generated id using uuid.js helper util
    };
    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });

    //may need to delete the following code; unclear if needed...
    const response = {
      status: "Success: Note saved.",
      body: newNote,
    };

    console.log(response); //add console logging for troubleshooting
    res.status(201).json(response);

  } else {
    res.status(500).json("Error: note could not be saved.");
  }
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  //curious if this const should be changed to = randomly generated id?
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
