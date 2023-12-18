const Router = require('express-promise-router');

const usersController = require('../controllers/users.controller');

module.exports = () => {
    const router = Router({ mergeParams: true });

    router.route('/signup').post(usersController.signup);

    router.route('/login').post(usersController.login);

    return router;
}


