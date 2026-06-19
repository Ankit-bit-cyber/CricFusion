const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
    console.log(`[Auth] Registration attempt for email: ${req.body?.email}`);
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`[Auth] Registration failed: Email already exists: ${email}`);
            return sendError(res, 400, 'User with this email already exists');
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);
        console.log(`[Auth] Registration successful: ${name} (${email})`);

        return sendSuccess(res, 201, 'Registration successful', {
            token,
            user: user.toPublicJSON(),
        });
    } catch (error) {
        console.error(`[Auth] Registration error for email: ${req.body?.email}:`, error);
        return sendError(res, 500, error.message);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    console.log(`[Auth] Login attempt for email: ${req.body?.email}`);
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log(`[Auth] Login failed: User not found for email: ${email}`);
            return sendError(res, 401, 'Invalid email or password');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log(`[Auth] Login failed: Incorrect password for email: ${email}`);
            return sendError(res, 401, 'Invalid email or password');
        }

        const token = generateToken(user._id);
        console.log(`[Auth] Login successful: ${user.name} (${email})`);

        return sendSuccess(res, 200, 'Login successful', {
            token,
            user: user.toPublicJSON(),
        });
    } catch (error) {
        console.error(`[Auth] Login error for email: ${req.body?.email}:`, error);
        return sendError(res, 500, error.message);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('followers', 'name avatar')
            .populate('following', 'name avatar');

        return sendSuccess(res, 200, 'User fetched', { user: user.toPublicJSON() });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

module.exports = { register, login, getMe };