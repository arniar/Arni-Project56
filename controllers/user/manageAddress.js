// controllers/addressController.js
const Address = require('../../models/address');

const session = '678e69ab60f79e1c8daa2f71'; // Replace with dynamic session handling

exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: session });
        res.render('../views/pages/user/manageAddress', { addresses });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.createAddress = async (req, res) => {
    try {
        const address = new Address({ ...req.body, userId: session });
        await address.save();
        res.status(201).json({ success: true, address });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, address });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.setPrimaryAddress = async (req, res) => {
    try {
        await Address.updateMany({ userId: session }, { isPrimary: false });
        const address = await Address.findByIdAndUpdate(req.params.id, { isPrimary: true }, { new: true });
        res.status(200).json({ success: true, address });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};