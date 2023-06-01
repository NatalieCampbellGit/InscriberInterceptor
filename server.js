// TODO in cosole: npm i
// Installs the dependencies packages in the package.json 
// TODO in console: node index.js
// Run the logo generator application  
// TODO the application will be accessible at http://localhost:3001.

//* Dependencies / node packages required for the app 
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./Develop/helpers/uuid'); // Helper method for generating unique ids

//* Establish the express.js 
const app = express();
const PORT = process.env.PORT || 3001; // HEROKU 

//* Paths to the directories as const's 
// Develop => db, helpers, public directories 
const dbPath = path.join(__dirname, '/db/db.json'); 
const assetsPath = path.join(__dirname, 'develop', 'public', 'assets');

//* Middleware
// from the public directory to parse the JSON data from there 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//* API Routes
// GET /api/notes - Reads notes from db.json and returns as JSON
app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

// POST /api/notes - request to add a note to the db.json
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`); // Log that a POST request was received
  
  const { title, text } = req.body; // Structuring the note items in req.body

   if (title && text) {  // If all the properties in the const are TRUE 
      const noteId = generateUniqueId(); // Then generate a unique ID for the note 

    // Create a new note object with the generated ID just made 
    const newNote = {
      id: noteId,
      title,
      text,
    };

    // Save the new note and send a response with the new note
    res.status(201).json(newNote);
  } else {
    // If error (e.g.: properties are missing) respond with an error message
    res.status(400).json('Error: Title and text are required');
  }
});

// DELETE /api/notes/:id - Delete a note with the given id 
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = getNotes();
  const updatedNotes = notes.filter((note) => note.id !== noteId);

  saveNotes(updatedNotes);

  res.sendStatus("Expunged"); // note deleted message - mischieved managed didn't seem appropriate here 
});

// Helper functions

// Read notes from db.json
function getNotes() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// Write notes to db.json
function saveNotes(notes) {
  fs.writeFileSync(dbPath, JSON.stringify(notes));
}

// Helper function to generate a unique id
function generateUniqueId() {
  return uuid.v4(); // Use the v4 method of the uuid package to generate a random UUID
}

// HTML Routes

// GET /notes - Return the notes.html file
app.get('/notes', (req, res) => 
  res.sendFile(path.join(__dirname, 'develop', 'public', 'notes.html'))
);

// GET * - Return the index.html file for all other routes
app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, 'develop', 'public', 'index.html'))
);

// Serve the style.css 
app.use('/assets', express.static(path.join(assetsPath, 'css')));

// Serve index.js file 
app.use('/assets/js', express.static(path.join(assetsPath, 'js')));

// Start the server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);