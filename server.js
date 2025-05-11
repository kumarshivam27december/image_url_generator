const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const Image = require('./models/Image');

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('uploads')); // serve images statically

// Connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Route to render form
app.get('/', (req, res) => {
  res.render('index', { imageUrl: null });
});

// Route to handle upload
app.post('/upload', upload.single('image'), async (req, res) => {
  const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;

  const newImage = new Image({
    filename: req.file.filename,
    url: imageUrl
  });
  await newImage.save();

  res.render('index', { imageUrl });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
