const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check header exists
    if (!authHeader) {
        return res.status(403).json({ message: 'Authorization header missing' });
    }

    // Format: "Bearer token"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded; // attaches user info (id, email) to request
        next();
    } catch (error) {
        console.error('❌ JWT verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};
