const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;

app.use(express.json());

let users = [];

const SECRET_KEY = 'your_secret_key';

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, email, password: hashedPassword });

  res.status(201).send('User signed up successfully!');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).send('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
});

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(400).send('Invalid token');
    req.user = decoded;
    next();
  });
};

app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ username: req.user.username });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
