const LibraryBook = require("../models/library");

exports.getAddBook =  async (req, res, next) => {
    try {
      const books = await LibraryBook.findAll();
      if (!books) {
        return res.status(404).json({ error: "No books found" });
      }
      res.status(200).json(books);
      res.status;
    } catch (err) {
      console.log("error in getting books from database:", err);
      res.status(500).json({ message: "Error fetching library books" });
    }
  }

exports.postAddBook = async (req, res, next) => {
    const title = req.body.title;
    const takeDate = req.body.takeDate;
    const returnDate = req.body.returnDate;
    const fine = req.body.fine;
    const returnedDate = req.body.returnedDate;
    try {
      const book = await LibraryBook.create({
        title: title,
        takeDate: takeDate,
        returnDate: returnDate,
        status: "taken",
        fine: fine,
        returnedDate: returnedDate,
      });
      res.status(201).json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating a library book" });
    }
  }

  exports.putUpdateBook = async (req, res) => {
    const bookId = req.params.id;
    const { status, returnedDate } = req.body;
    const fine = parseInt(req.body.fine);
    console.log(req.body);
    try {
      const book = await LibraryBook.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      // Update the book's status, fine, and returnedDate
      book.status = status;
      book.fine = fine;
      book.returnedDate = returnedDate;
  
      await book.save();
  
      return res
        .status(200)
        .json({ message: "Book status and fine updated successfully" });
    } catch (error) {
      console.error("Error in updating book status and fine:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }