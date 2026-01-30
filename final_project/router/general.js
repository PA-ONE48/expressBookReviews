const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Added for Task 10-13 requirements

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

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];
    Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    });
    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor));
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
            booksByTitle.push(books[key]);
        }
    });
    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle));
    } else {
        res.status(404).json({ message: "No books found for this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 10: Get all books – Using async/await
async function getBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// Task 11: Search by ISBN – Using Promises
function getBookByISBN(isbn) {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
        });
}

// Task 12: Search by Author
async function getBookByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// Task 13: Search by Title
async function getBookByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

module.exports.general = public_users;
