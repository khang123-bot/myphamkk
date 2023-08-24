import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js'

//fetch all products
const getProducts = asyncHandler( async (req, res) => {

    const pageSize = process.env.PAGINATION_LIMIT || 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? { name: {$regex: req.query.keyword, $options: 'i'}} : {};

    const count = await Product.countDocuments({...keyword});

    const products = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page-1));

    res.json({products, page, pages: Math.ceil(count/pageSize)});
})

//fetch single product by id
const getProductById = asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm')
    }
})

//create new product
const createProduct = asyncHandler( async (req, res) => {
    
    const {
        name, price, image, countInStock, numReviews, description, brand, category
    } = req.body;

   const product = await Product.create({
        name,
        price,
        user: req.user._id,
        image: image ||'/images/sample.jpg',
        countInStock: countInStock || 0,
        numReviews: numReviews || 0,
        description,
        brand,
        category,
   })
   const createdProduct = await product.save();
   res.status(201).json(createdProduct)
})

//Update a product
const updateProduct = asyncHandler( async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;
    const product = await Product.findById(req.params.id);
    if(product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        product.image = image;
        product.brand = brand;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm')
    }
})

//Delete a product
const deleteProduct = asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        await Product.deleteOne({_id: product._id});
        res.status(200).json({
            message: 'Sản phẩm đã được xóa thành công'
        })
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm')
    }
})

//Create a new review
//POST /api/products/:id/reviews
const createProductReview = asyncHandler( async (req, res) => {
    const {rating, comment} = req.body;

    const product = await Product.findById(req.params.id);
    if(product) {
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );
        if(alreadyReviewed) {
            res.status(400);
            throw new Error('Sản phẩm này đã được bạn đánh giá rồi')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({
            message: 'Đánh giá đã được thêm vào sản phẩm'
        })
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm')
    }
});

//Get top rated product
const getTopProducts = asyncHandler( async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3);
    res.status(200).json(products);
})

export {getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts}