const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.initializeAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: ADMIN_EMAIL });
        if (!adminExists) {
            const admin = new User({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created');
        }
    } catch (err) {
        console.error('Error initializing admin:', err);
    }
};