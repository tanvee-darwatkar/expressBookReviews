const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1 & Task 10: Get the book list available in the shop using Async/Await / Promises
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const bookList = await getBooks;
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 3 & Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let matching_books = [];
    for (let key in books) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matching_books.push({
          isbn: key,
          author: books[key].author,
          title: books[key].title,
          reviews: books[key].reviews
        });
      }
    }
    if (matching_books.length > 0) {
      resolve(matching_books);
    } else {
      reject("No books found for this author");
    }
  });

  getBooksByAuthor
    .then((booksList) => res.send(JSON.stringify(booksList, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 4 & Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let matching_books = [];
    for (let key in books) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matching_books.push({
          isbn: key,
          author: books[key].author,
          title: books[key].title,
          reviews: books[key].reviews
        });
      }
    }
    if (matching_books.length > 0) {
      resolve(matching_books);
    } else {
      reject("No books found with this title");
    }
  });

  getBooksByTitle
    .then((booksList) => res.send(JSON.stringify(booksList, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
