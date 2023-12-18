const express = require('express');
const pictureRoutes = require('./picture.route');
const usersRoutes = require('./users.route');
const apiRouter = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = () =>
    apiRouter
        .use('/api/picture', authMiddleware, pictureRoutes())
        .use('/api/user', usersRoutes())
        .all('*', () => {
            throw new Error("Not Found");
        });