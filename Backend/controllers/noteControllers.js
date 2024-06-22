const Note = require("../models/noteModal");
const asyncHandler = require("express-async-handler");

// controller to et all notes list from mongodb
const getNotes = asyncHandler(async (req, res) => {
  // find all of the notes that belongs to a particular user

  const notes = await Note.find({ user: req?.user?._id });

  res.json({ error: false, notes });
});

// controller handler to create a note
const createNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res
      .status(400)
      .json({ error: true, reason: "Required fields not provided" });
  }

  // req.user -> coming from the 'protect' middleware
  const newNote = new Note({ user: req?.user?._id, title, content, category });

  const createdNote = await newNote.save();
  res.status(201).json(createdNote);
});

// controller to get a single note with given id
const getSingleNoteById = asyncHandler(async (req, res) => {
  const foundNote = await Note.findById(req?.params?.id);

  if (!foundNote) {
    return res.status(404).json({ error: true, reason: "Note not found!" });
  }

  res.status(201).json(foundNote);
});

// controller to update a single note with given id
const updateSingleNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  console.log(req?.params);

  const foundNote = await Note.findById(req?.params?.id);

  if (foundNote?.user?.toString() !== req.user?._id?.toString()) {
    return res.status(400).json({ error: true, reason: "Not authorized!" });
  }

  if (foundNote) {
    foundNote.title = title;
    foundNote.content = content;
    foundNote.category = category;

    const updatedNote = await foundNote.save();
    res.json(updatedNote);
  } else {
    return res.status(404).json({ error: true, reason: "Note  not found" });
  }
});

// controller to delete a note
const deleteNote = asyncHandler(async (req, res) => {
  const foundNote = await Note.findById(req?.params?.id);

  if (foundNote?.user?.toString() !== req.user?._id?.toString()) {
    return res.status(400).json({ error: true, reason: "Not authorized!" });
  }

  if (foundNote) {
    await foundNote.deleteOne();
    res.json({ message: "Note removed" });
  } else {
    res.status(404).json({ reason: "Note not found" });
  }
});

module.exports = {
  getNotes,
  createNote,
  getSingleNoteById,
  updateSingleNote,
  deleteNote,
};
