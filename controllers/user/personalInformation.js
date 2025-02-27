// controllers/profileController.js
const User = require('../../models/user');

const session = '678e69ab60f79e1c8daa2f71'; // Replace with dynamic session handling

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: session }).select('-password');
        res.render('../views/pages/user/personalInformation', { 
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const updatedUser  = await User.updateOne({ _id: session }, { username: username });
        res.json({ success: true, user: updatedUser  });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Uncomment and implement the upload photo functionality if needed
/*
exports.uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'profile-photos',
            public_id: `user-${req.user._id}`,
            overwrite: true,
            transformation: [
                { width: 300, height: 300, crop: 'fill', gravity: 'face' }
            ]
        });

        // Update user profile with new image URL
        await User.findByIdAndUpdate(req.user._id, {
            profileImage: result.secure_url,
            updatedAt: Date.now()
        });

        res.json({ success: true, imageUrl: result.secure_url });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
*/