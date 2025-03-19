const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key'; // Change this to a strong secret key

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/covers', express.static(path.join(__dirname, 'public/covers'))); // Serve book cover images

// ✅ MySQL Database Connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Set your MySQL password if needed
    database: 'library_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// 🔐 **JWT Authentication Middleware**
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid or expired token.' });
        req.user = decoded;
        next();
    });
};

// 📝 **User Signup (Username & Password Only)**
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error. Could not register user.' });
    }
});

// 🔐 **User Login with JWT (Using Username)**
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// 📚 **Add a Book**
app.post('/add-book', async (req, res) => {
    const { title, author, genre, isbn, cover_image } = req.body;
    if (!title || !author || !genre || !isbn || !cover_image) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO books (title, author, genre, isbn, available, status, cover_image) VALUES (?, ?, ?, ?, 1, "available", ?)',
            [title, author, genre, isbn, cover_image]
        );
        res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 📚 **Get All Books**
app.get('/books', async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Server error. Could not retrieve books.' });
    }
});

// 🚀 **Start Server**
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
