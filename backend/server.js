const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const USERS_FILE = path.join(__dirname, 'users.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  let users = readUsers();

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists!' });
  }

  users.push({ username, email, password });
  writeUsers(users);

  res.status(201).json({ message: 'User signed up successfully!' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password!' });
  }

  res.json({
    message: 'Login successful!',
    user: { username: user.username, email: user.email, role: user.role || 'User' }
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  const { username } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const users = readUsers();
  const userIndex = users.findIndex(user => user.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const uploadedFile = {
    id: Date.now(),
    name: req.file.originalname,
    url: `http://localhost:3000/uploads/${req.file.filename}`
  };

  users[userIndex].uploadedDocuments = users[userIndex].uploadedDocuments || [];
  users[userIndex].uploadedDocuments.push(uploadedFile);
  writeUsers(users);

  res.json({ message: 'File uploaded successfully', document: uploadedFile, uploadedDocuments: users[userIndex].uploadedDocuments });
});

app.get('/api/users', (req, res) => {
  res.json(readUsers());
});

app.get('/api/users/:username', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.username === req.params.username);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

app.delete('/api/users/:username/documents/:docId', (req, res) => {
  const { username, docId } = req.params;
  const users = readUsers();

  const userIndex = users.findIndex(user => user.username === username);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = users[userIndex];
  user.uploadedDocuments = user.uploadedDocuments || [];

  const docIndex = user.uploadedDocuments.findIndex(doc => doc.id == docId);
  if (docIndex === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  user.uploadedDocuments.splice(docIndex, 1);
  writeUsers(users);

  res.json({ message: 'Document deleted successfully', uploadedDocuments: user.uploadedDocuments });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
