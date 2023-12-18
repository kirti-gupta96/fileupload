const Router = require('express-promise-router');
const multer = require('multer');

const pictureController = require('../controllers/picture.controller');
const upload = multer({ dest: 'uploads/' });

module.exports = () => {
    const router = Router({ mergeParams: true });

    router.route('/upload').post(upload.single('file'), pictureController.uploadFile);
    
    router.route('/getList').get(pictureController.getFileList);

    router.route('/:fileId')
        .get(pictureController.getFileById)
        .put(upload.single('file'), pictureController.updateFile)
        .delete(pictureController.deleteFile);

    return router;
}


