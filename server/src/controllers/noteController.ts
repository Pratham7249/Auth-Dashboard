import { Request, Response } from 'express';
import Note from '../models/Note';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get all notes
// @route   GET /api/v1/notes
// @access  Private
export const getNotes = async (req: AuthRequest, res: Response) => {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
};

// @desc    Create a note
// @route   POST /api/v1/notes
// @access  Private
export const createNote = async (req: AuthRequest, res: Response) => {
    if (!req.body.title || !req.body.content) {
        res.status(400).json({ message: 'Please add a title and content' });
        return;
    }

    const note = await Note.create({
        user: req.user._id,
        title: req.body.title,
        content: req.body.content,
        isFavorite: req.body.isFavorite || false,
    });

    res.status(200).json(note);
};

// @desc    Update a note
// @route   PUT /api/v1/notes/:id
// @access  Private
export const updateNote = async (req: AuthRequest, res: Response) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404).json({ message: 'Note not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedNote);
};

// @desc    Delete a note
// @route   DELETE /api/v1/notes/:id
// @access  Private
export const deleteNote = async (req: AuthRequest, res: Response) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404).json({ message: 'Note not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await note.deleteOne();

    res.status(200).json({ id: req.params.id });
};
