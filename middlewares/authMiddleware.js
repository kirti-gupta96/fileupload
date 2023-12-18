const jwt = require('jsonwebtoken');
const { secretKey } = require('../utils/constants');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ message: 'Token is not provided' });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }
            req.userInfo = decoded;
            next();
        });

    } catch (error) {
        console.log("Error from auth middleware", error);
        return res.status(500).json({ error: error.message });
    }
}
