const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateId } = require('../utils/generateId');
const { secretKey } = require('../utils/constants');
const Users = require('../db/schemas/users.schema.js');

const signup = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request is empty.');
        }
        const { email, password, role, name } = req.body;

        const user = await Users.findOne({ email });

        if (user) {
            return res.status(400).send('User already exists');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        await Users.create({
            email,
            password: hashedPassword,
            role,
            name,
            userId: generateId("users")
        });

        res.json({
            success: true,
            message: "Sign up completed"
        });
    } catch (error) {
        throw error;
    }
};

const login = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request is empty.');
        }
        const { email, password } = req.body;

        const user = await Users.findOne({ email }, { email: 1, password: 1, userId: 1, role: 1 });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if(passwordMatch) {
                const token = jwt.sign({ id: user.userId, email: user.email, role: user.role }, secretKey, { expiresIn: '24h' });
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }      
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }

    } catch (error) {
        throw error;
    }
};

module.exports = {
    signup,
    login
};
