// server.mjs
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Dummy data for notes
let notes = [
    { id: 1, content: 'Cat', imageUrl: '', imageAuthor: '', imageAuthorLink: '' },
    // Add more notes as needed
];

// Middleware to fetch an image from Unsplash based on note content
const fetchAndUpdateNoteImage = async (note, query) => {
    try {
        const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1`, {
            headers: {
                Authorization: `Client-ID ${unsplashAccessKey}`,
            },
        });
        const data = await response.json();
        if (data.results.length > 0) {
            const result = data.results[0];
            note.imageUrl = result.urls.regular;
            note.imageAuthor = result.user.name;
            note.imageAuthorLink = result.user.links.html;
        }
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
    }
};

// GET /notes - Get all notes
app.get('/notes', (req, res) => {
    res.json(notes);
});

// GET /notes/:id - Get a single note by ID
app.get('/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id, 10);
    const note = notes.find(note => note.id === noteId);
    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
});

// POST /notes - Create a new note
app.post('/notes', (req, res) => {
    const { content, imageUrl, imageAuthor, imageAuthorLink } = req.body;

    const id = notes.length ? notes[notes.length - 1].id + 1 : 1;
    const newNote = { id, content, imageUrl, imageAuthor, imageAuthorLink };
    notes.push(newNote);
    res.status(201).json(newNote);
});

// PATCH /notes/:id - Edit a note by ID
app.patch('/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id, 10);
    const { content, imageUrl, imageAuthor, imageAuthorLink } = req.body;
    const note = notes.find(note => note.id === noteId);
    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    // Update note content and image information
    note.content = content;
    note.imageUrl = imageUrl;
    note.imageAuthor = imageAuthor;
    note.imageAuthorLink = imageAuthorLink;

    res.json(note);
});

// PATCH /notes/:id/image - Fetch and update note image from Unsplash
app.patch('/notes/:id/image', async (req, res) => {
    const noteId = parseInt(req.params.id, 10);
    const note = notes.find(note => note.id === noteId);
    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    const { content } = note;
    await fetchAndUpdateNoteImage(note, content);

    res.json({
        imageUrl: note.imageUrl,
        imageAuthor: note.imageAuthor,
        imageAuthorLink: note.imageAuthorLink,
    });
});

// DELETE /notes/:id - Delete a note by ID
app.delete('/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id, 10);
    const index = notes.findIndex(note => note.id === noteId);
    if (index === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }

    notes.splice(index, 1);
    res.status(204).end();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
