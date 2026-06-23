const jwt = require('jsonwebtoken');
const User = require ('../models/User');
const protect = async (req,res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        }  catch (error) {
            console.error('Token verification failed: ', error);
            return res.status(401).json({ message: 'Not authorized, token failed'});
        }
    } 
    if(!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided'});
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req,res,next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Role '${req.user?.role}' does not have the permission to perform this action.`
            });
        }
        next();
    };
};
module.exports = { protect, authorizeRoles };
