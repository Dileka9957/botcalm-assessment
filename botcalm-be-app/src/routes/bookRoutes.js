const express = require("express");
const router = express.Router();
const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { protect, authorize } = require("../utils/auth");

router
  .route("/")
  .get(getBooks)
  .post(protect, authorize("publisher", "admin"), createBook);

router
  .route("/:id")
  .get(getBook)
  .put(protect, authorize("publisher", "admin"), updateBook)
  .delete(protect, authorize("admin"), deleteBook);

module.exports = router;
