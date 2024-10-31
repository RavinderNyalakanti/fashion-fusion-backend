const express = require('express');
const cors = require('cors');
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4012;

// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const accessoriesRoutes = require('./routes/accessoriesRoutes'); // Correct import
const authRoutes = require('./routes/authRoutes'); // Correct import

// app.use('/products', productRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accessories', accessoriesRoutes); // Correct usage


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "./public/uploads";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
  
  app.post("/api/photos", upload.single("photo"), (req, res) => {
    const file = req.file;
    const uri = `${file.filename}`;
    res.json({ file, uri });
  });
  
  app.get("/api/photos/:filename", (req, res) => {
    const file = req.params.filename;
    const filePath = path.join(__dirname, "public/uploads", file);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ err: "No file exists" });
      }
      res.sendFile(filePath);
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
