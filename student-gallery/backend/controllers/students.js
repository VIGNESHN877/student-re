const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { name, rollNumber, department, year, details } = req.body;
        
        const student = new Student({
            name,
            rollNumber,
            department,
            year,
            details
        });

        await student.save();
        res.status(201).json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        student.images.push({ path: req.file.filename });
        await student.save();

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const image = student.images.id(req.params.imageId);
        if (!image) return res.status(404).json({ message: 'Image not found' });

        // Delete file from uploads folder
        const imagePath = path.join(__dirname, '../uploads', image.path);
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        student.images.pull(req.params.imageId);
        await student.save();

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { name, department, year, details } = req.body;
        
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { name, department, year, details },
            { new: true }
        );

        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Delete all images
        student.images.forEach(image => {
            const imagePath = path.join(__dirname, '../uploads', image.path);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        });

        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};