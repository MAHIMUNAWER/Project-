const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const { getMyListings, getAllListings, createListing, updateListing, deleteListing } = require('../controllers/listingController');
const router = express.Router();

// ── Multer storage config ─────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../../frontend/uploads/listings');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 3 * 1024 * 1024 } }); // 3 MB

// ── Routes ────────────────────────────────────────────────────────────────
router.get('/all', getAllListings);
router.get   ('/',    getMyListings);

router.post  ('/',    upload.single('image'), createListing);
router.put   ('/:id', upload.single('image'), updateListing);
router.delete('/:id', deleteListing);

module.exports = router;