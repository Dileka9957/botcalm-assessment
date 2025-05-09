const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
    maxlength: [50, "Author name cannot exceed 50 characters"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    enum: {
      values: [
        "Fiction",
        "Non-Fiction",
        "Science Fiction",
        "Fantasy",
        "Mystery",
        "Thriller",
        "Romance",
        "Biography",
        "History",
      ],
      message: "Please select a valid genre",
    },
  },
  publicationDate: {
    type: Date,
    required: [true, "Publication date is required"],
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: "Publication date cannot be in the future",
    },
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  isbn: {
    type: String,
    unique: true,
    required: [true, "ISBN is required"],
    validate: {
      validator: function (v) {
        return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(v);
      },
      message: "Please enter a valid ISBN (10 or 13 digits)",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema);
