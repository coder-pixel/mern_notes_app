const express = require("express");
const {
  getNotes,
  createNote,
  getSingleNoteById,
  updateSingleNote,
  deleteNote,
} = require("../controllers/noteControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getNotes);
router.route("/create").post(protect, createNote);
router
  .route("/:id")
  .get(getSingleNoteById)
  .put(protect, updateSingleNote)
  .delete(protect, deleteNote);
// updating and deleting and getting one single note

module.exports = router;
