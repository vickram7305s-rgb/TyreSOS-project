const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (for demo purposes)
const users = [];

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});