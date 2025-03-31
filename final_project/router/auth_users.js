const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}




//only registered users can login



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    let book = books[isbn]
    if (book) {  // Check if book exists
        
        let username = req.session.username;
        let review = req.body.review;
        
        book.reviews[username] = review;
        res.send("Review saved successfully.");
    }
    // Or else inform book doesn't exist
    res.send("Unable to find book!");
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
