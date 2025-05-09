const Book = require("../models/Book");

// Create a new book
exports.createBook = async (req, res, next) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "ISBN already exists",
      });
    } else {
      next(err);
    }
  }
};

// Get all books
exports.getBooks = async (req, res, next) => {
  try {
    const { genre, author, sort } = req.query;
    const query = {};

    if (genre) query.genre = genre;
    if (author) query.author = { $regex: author, $options: "i" };

    let books = Book.find(query);

    if (sort) {
      const sortFields = sort.split(",").join(" ");
      books = books.sort(sortFields);
    } else {
      books = books.sort("-createdAt");
    }

    const result = await books.exec();
    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single book
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }
    next(err);
  }
};

// Update book
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    // Prevent ISBN change
    if (req.body.isbn && req.body.isbn !== book.isbn) {
      return res.status(400).json({
        success: false,
        error: "ISBN cannot be changed",
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    } else {
      next(err);
    }
  }
};

// Delete book
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    await book.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }
    next(err);
  }
};
