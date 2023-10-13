const express = require("express");
const router = express.Router();
const LibraryBook = require("../models/library");
const postBookController = require("../controller/library")

// POST route to add a new library book
router.post("/add",postBookController.postAddBook );
// GET route get library book
router.get("/books",postBookController.getAddBook);

// PUT route for updating a book's status and fine
router.put("/updateBook/:id",postBookController.putUpdateBook );

module.exports = router;
