const Product = require('../../models/product');
const User = require('../../models/user');
const mainCategory = require('../../models/mainCategory');
const subCategory = require('../../models/subCategory');
const Variant = require('../../models/variant');
const mongoose = require('mongoose'); // Ensure mongoose is imported

const getProductsByMainCategory = async (req, res, next) => {
  try {
    const main = req.query.main; // Main category ID from query
    if (!main) {
      return res.status(400).send('Main category is required.');
    }

    // Fetch subcategories for the given main category
    const subCategories = await subCategory.find({ mainCategory: main });
    const cards = []; // Initialize cards array

    // Iterate through subcategories
    for (const category of subCategories) {
      const variants = await Variant.aggregate([
        {
          $lookup: {
            from: "products", // Join with products collection
            localField: "productId", // Match productId in variants
            foreignField: "_id", // Match _id in products
            as: "productDetails", // Save result as productDetails
          }
        },
        { $unwind: "$productDetails" }, // Flatten the productDetails array
        {
          $match: {
            "productDetails.subCategory": category._id, // Filter by current subcategory ID
            "productDetails.status": "active" // Filter
          }
        },
        {
          $project: {
            _id: 1,
            productId: 1,
            color: 1,
            images: { $arrayElemAt: ["$images", 0] }, // Include only the first image
            sizes: 1,
            tags: 1,
            productDetails: 1,
          }
        }
      ]);

      // Push results to cards array
      if (variants.length > 0) {
        cards.push(...variants); // Add the first variant of the subcategory to the cards
      }
    }

    console.log(cards); // Debugging: Log the cards array
    const authentication = req.session.isAuthenticated;
    // Render the kids page with cards data
    res.render('../views/pages/index/kid', { cards, authentication});

  } catch (err) {
    console.error('Error fetching data:', err);
    next(err); // Pass the error to the error handler
  }
};

module.exports = {
  getProductsByMainCategory,
};