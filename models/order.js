const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true }, // Added size field
    variant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Variant', // Reference to the Variant collection
        required: true 
    }, 
    orderDate: { type: Date, default: Date.now },
    paymentMethod: {
        type: String,
        enum: ['cod', 'credit', 'debit', 'upi'],
        required: true
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required'],
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true,
        },
    }
});

module.exports = mongoose.model('Order', orderSchema);
