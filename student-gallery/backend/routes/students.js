const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const studentController = require('../controllers/students');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Public routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);

// Protected routes (require authentication)
router.post('/', auth, studentController.createStudent);
router.post('/:id/images', auth, upload.single('image'), studentController.uploadImage);
router.put('/:id', auth, studentController.updateStudent);
router.delete('/:id', auth, studentController.deleteStudent);
router.delete('/:studentId/images/:imageId', auth, studentController.deleteImage);

module.exports = router;