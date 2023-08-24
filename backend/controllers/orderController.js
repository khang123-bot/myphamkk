import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

//Create new order
//POST  /api/orders
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if(orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('Không có đơn hàng')
    } else {
        const order = new Order({
            orderItems: orderItems.map( x => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });
        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
})

//Get logged in user order
//GET  /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
})

//Get order by id
//GET  /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng')
    }
})

//Update order to paid
//PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng')
    }
})

//Update order to deliver
//ADMIN
//GET /api/orders/:id/delivery
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404)
        throw new Error('Không tìm thấy đơn hàng')
    }
})

//Get all order
//ADMIN
//GET  /api/orders
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
})

export {
    addOrderItems, 
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
}