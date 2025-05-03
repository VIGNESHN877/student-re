const Student = require('../models/Student');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalImages = await Student.aggregate([
            { $project: { count: { $size: "$images" } } },
            { $group: { _id: null, total: { $sum: "$count" } } }
        ]);
        
        res.json({
            totalStudents,
            totalImages: totalImages.length > 0 ? totalImages[0].total : 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};