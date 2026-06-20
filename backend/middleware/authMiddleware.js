const jwt = require('jsonwebtoken');
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return sendError(res, 401, 'Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return sendError(res, 401, 'User not found');
        next();
    } catch (error) {
        return sendError(res, 401, 'Not authorized, token invalid');
    }
};

module.exports = { protect };