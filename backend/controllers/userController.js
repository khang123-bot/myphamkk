import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

//Auth User & get token
//POST /api/users/login
const authUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))) {

        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            phone: user.phone
        })
    } else {
        res.status(401);
        throw new Error('Thông tin đăng nhập không đúng');
    }
})

//Log out user / clear cookie
//POST /api/users/logout
const logoutUser = asyncHandler( async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Log' })
})

//Register
//POST /api/users/register
const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password, phone } = req.body;

    const userExit = await User.findOne({email});
    if(userExit){
        res.status(400);
        throw new Error('Người dùng đã tồn tại! Vui lòng chọn tên khác')
    }

    const user = await User.create({ name, email, password, phone });

    if(user){

        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            phone: user.phone   
        })
    } else {
        res.status(400);
        throw new Error('Dữ liệu người dùng không hợp lệ');
    }
})

//Get user 
//GET /api/users/profile
const getUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            phone: user.phone   
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

//Update user profile
//PUT /api/users/profile
const updateUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

//Get users 
//GET /api/users/:id
const getUsers = asyncHandler( async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);    
})

//Get users 
//GET /api/users/:id
const getUserById = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy người dùng')
    }
})

//Update user profile
//POST /api/users/profile
const updateUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404);
        throw new Error('Không tìm thấy người dùng')
    }
})

//Update user profile
//POST /api/users/profile
const deleteUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        if(user.isAdmin) {
            res.status(400);
            throw new Error('Không thể xóa người quản trị admin')
        }
        await User.deleteOne({_id: user._id})
        res.status(200).json({
            message: 'Đã xóa thành công người dùng'
        }) 
    } else {
        res.status(404);
        throw new Error('Không tìm thấy người dùng')
    }
 })

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}