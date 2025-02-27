const Product = require('../../models/product');
const Variant = require('../../models/variant');
const mainCategory = require('../../models/mainCategory');
const subCategory = require('../../models/subCategory');
const cloudinary = require('../../config/cloudinary');

// GET home page
exports.getHomePage = async (req, res, next) => {
  try {
    req.session.productId = req.query.id;
    res.render('../views/pages/admin/products');
  } catch (error) {
    next(error);
  }
};

// POST route to fetch products table
exports.getProductsTable = async (req, res, next) => {
  try {
    let mainCategories = await mainCategory.find();
    let subCategories = await subCategory.find();
    let products;

    if (req.session.productId) {
      products = await Product.find({ subCategory: req.session.productId });
    } else {
      products = await Product.find({});
    }

    res.render('../views/partials/admin/productsTable', { products, mainCategories, subCategories });
  } catch (error) {
    next(error);
  }
};

// GET route to add product
exports.getAddProductPage = async (req, res, next) => {
  try {
    let mainCategories = await mainCategory.find();
    let subCategories = await subCategory.find();
    res.render('../views/pages/admin/addProducts', { mainCategories, subCategories });
  } catch (error) {
    next(error);
  }
};

// POST route to add product
exports.addProduct = async (req, res, next) => {
  try {
    console.log("hi")
    let product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      subCategory: req.body.category,
      discountPrice: req.body.price
    });

    let variants = req.body.variants;
    console.log("variants", variants);
    for (let variant of variants) {
      let photos = [];
      for (let i of variant.images) {
        const result = await cloudinary.uploader.upload(i, {
          folder: 'products'
        });
        photos.push(result.secure_url);
      }
      await Variant.create({
        productId: product._id,
        color: variant.color,
        images: photos,
        sizes: variant.sizes,
        tags: variant.tags
      });
    }
    res.send('done');
  } catch (error) {
    next(error);
  }
};

// GET route to edit product
exports.getEditProductPage = async (req, res, next) => {
  try {
    let mainCategories = await mainCategory.find();
    let subCategories = await subCategory.find();
    res.render('editProduct', { mainCategories, subCategories });
  } catch (error) {
    next(error);
  }
};

// POST route to edit product
exports.editProduct = async (req, res, next) => {
  try {
    await Product.updateOne(
      { _id: req.body.id },
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        subCategory: req.body.category
      }
    );
    res.redirect(`/admin/products?id=${req.body.category}`);
  } catch (error) {
    next(error);
  }
};

// DELETE route to delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.body.id;
    await Product.deleteOne({ _id: id });
    res.send("ok");
  } catch (error) {
    next(error);
  }
};

// PATCH route to inactivate product
exports.inactivateProduct = async (req, res, next) => {
  try {
    const id = req.body.id;
    await Product.updateOne({ _id: id }, { status: "inactive" });
    res.send("ok");
  } catch (error) {
    next(error);
  }
};

// PATCH route to activate product
exports.activateProduct = async (req, res, next) => {
  if (req.session.subCategoryStatus === "inactive") {
    return res.send("main");
  }
  try {
    const id = req.body.id;
    await Product.updateOne({ _id: id }, { status: "active" });
    res.send("done");
  } catch (error) {
    next(error);
  }
};