const User = require('../../models/user');
const blockUser  = require('../../models/blockUser');

exports.getUsersPage = (req, res) => {
    req.session.condition = req.query.condition || "All";
    console.log(req.session.condition);
    res.render('../views/pages/admin/users');
};

exports.getUsersTable = async (req, res, next) => {
    try {
        let users;
        if (req.session.condition === "All") {
            users = await User.find({ role: "User" });
        } else {
            users = await User.find({ status: req.session.condition, role: "User" });
        }
        console.log(users);
        return res.render('../views/partials/admin/usersTable', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        next(error); // Pass the error to the error handler
    }
};

exports.blockUser  = async (req, res, next) => {
    try {
        const blockReason = req.body.blockReason;
        const id = req.body.id;
        await blockUser .create({ user: id, blockReason: blockReason });
        await User.updateOne({ _id: id }, { status: "Suspended" });
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error blocking user:', error);
        next(error); // Forward error to the next middleware
    }
};

exports.unblockUser  = async (req, res, next) => {
    try {
        const id = req.body.id;
        await blockUser .deleteOne({ user: id });
        await User.updateOne({ _id: id }, { status: "Inactive" });
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error unblocking user:', error);
        next(error); // Forward error to the next middleware
    }
};

exports.searchUsers = async (req, res, next) => {
    try {
        console.log(req.query.value);
        let users;
        if (req.session.condition === "All") {
            users = await User.find({ role: "User ", email: { $regex: `${req.query.value}`, $options: 'i' } });
        } else {
            users = await User.find({ status: req.session.condition, role: "User ", email: { $regex: `${req.query.value}`, $options: 'i' } });
        }
        console.log(users);
        return res.render('adminUsers/table', { users });
    } catch (error) {
        console.error('Error searching users:', error);
        next(error); // Pass the error to the error handler
    }
};