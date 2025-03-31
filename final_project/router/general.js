const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});


public_users.put("/auth/review/:isbn", (req, res) => {
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




public_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    let book = books[isbn]
    
    if (book && book.reviews) {  // Check if the book exists and has reviews
        
        
                res.send("Review deleted successfully.");
        
    } 
    // If the book doesn't exist, inform user
    else {
        res.status(404).send("Book not found!");
    }
    

});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    let book = books[isbn]
    if (book) {  // Check if book exists
        res.json(book);
    }
    // Or else inform book doesn't exist
    res.send("Unable to find book!");
});

public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    let bookList = Object.values(books).filter(book => book.author === author);
    
    if (bookList.length > 0) { // Check if books found
      return res.json(bookList);
    }
    // Or else inform no books found for this author
    res.send("Unable to find autor!");
  });

  public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    let bookList = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    
    if (bookList.length > 0) { // Check if books found
      return res.json(bookList);
    }
    // Or else inform no books found for this title
    return res.status(404).json({ message: `No books found with the title '${title}'` });
  });

  public_users.get('/review/:isbn', (req, res) => {
    const isbn = parseInt(req.params.isbn);
    let book = books[isbn]
    if (book) {  // Check if book exists
        res.json(book.reviews || {});
    }
    // Or else inform book doesn't exist
    return res.status(404).json({ message: `No book found with ISBN ${isbn}` });
  });

  
module.exports.general = public_users;
