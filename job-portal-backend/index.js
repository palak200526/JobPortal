const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

// Initialize Database Tables if they don't exist
const initDB = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('seeker', 'recruiter')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS seeker_profiles (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        skills TEXT,
        resume_url TEXT
      );

      CREATE TABLE IF NOT EXISTS recruiter_profiles (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255),
        company_website VARCHAR(255),
        role_title VARCHAR(255)
      );
    `);
        console.log('Database tables initialized.');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
};
initDB();

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
    const { role, name, email, password, skills, resume_url, company_name, company_website, role_title } = req.body;

    if (!role || !name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );
        const userId = newUser.rows[0].id;

        // Insert profile based on role
        if (role === 'seeker') {
            await pool.query(
                'INSERT INTO seeker_profiles (user_id, skills, resume_url) VALUES ($1, $2, $3)',
                [userId, skills || '', resume_url || '']
            );
        } else if (role === 'recruiter') {
            await pool.query(
                'INSERT INTO recruiter_profiles (user_id, company_name, company_website, role_title) VALUES ($1, $2, $3, $4)',
                [userId, company_name || '', company_website || '', role_title || '']
            );
        }

        // Generate Token
        const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'User signed up successfully', token, user: newUser.rows[0] });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
