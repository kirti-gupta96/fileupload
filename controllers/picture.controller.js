const fs = require('fs');
const { generateId } = require('../utils/generateId');
const Pictures = require('../db/schemas/pictures.schema.js');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const { originalFileName, path, mimetype } = req.file;
        const imageBuffer = fs.readFileSync(path);
 
        const result = await Pictures.create({
            description: req.body.description,
            fileId: generateId('pictures'),
            fileData: imageBuffer,
            contentType: mimetype,
            fileName: originalFileName
        });

        res.json({ success: true, message: "Picture uploaded successfully", fileId: result.fileId });
    } catch (error) {
        throw error;
    }
};

const getFileById = async (req, res) => {
    try {
        const { fileId } = req.params;
        const pictureData = await Pictures.findOne({ fileId, deletedAt: { $exists: false } });
        if (!pictureData) {
            return res.status(400).json({ message: "Data doesn't exists" });
        }
        return res.json(pictureData);
    } catch (error) {
        throw error;
    }
}

const updateFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        if (!fileId) {
            return res.status(400).json({ message: "File Id not present" });
        }
        if (!req.body) {
            return res.status(400).json({ message: "Request is not proper" });
        }
        let updateObj = {
            description: req.body.description,
        };

        if(req.file) {
            const { originalFileName, path, mimetype } = req.file;
            const imageBuffer = fs.readFileSync(path);
            updateObj = {
                ...updateObj,
                fileData: imageBuffer,
                contentType: mimetype,
                fileName: originalFileName
            };
        }
    
        await Pictures.updateOne({ file_id: fileId, deletedAt: { $exists: false } }, { $set: updateObj });
        return res.json({ success: true, message: "Updated successfully" });
    } catch (error) {
        throw error;
    }
}

const deleteFile = async (req, res) => {
    try {
        const { fileId = "" } = req.params;
        if (!fileId) {
            return res.status(400).json({ message: "File Id not present" });
        }

        let fileData = await Pictures.findOne({ fileId });
        if (!fileData) {
            return res.status(400).json({ message: "Data doesn't exists" });
        }
        await Pictures.updateOne({ fileId }, { $set: { deletedAt: new Date() } });
        return res.json({ success: true, message: "Delete successfully" });
    } catch (error) {
        throw error;
    }
}

const getFileList = async (req, res) => {
    try {
        const page = {
            skip: req.query.skip ? Number(req.query.skip) : 0,
            limit: req.query.limit ? Number(req.query.limit) : 10
        }

        let fileData = await Pictures.find({ deletedAt: { $exists: false }}, {}, page);

        if (!fileData) {
            return res.status(400).json({ message: "Data doesn't exists" });
        }

        let fileDataCount = await Pictures.countDocuments({ deletedAt: { $exists: false }});

        return res.json({
            result: fileData,
            total: fileDataCount,
            moreAvailable: page.skip + page.limit < fileDataCount
        })
    } catch (error) {
        throw error;

    }
}

module.exports = {
    uploadFile,
    getFileById,
    updateFile,
    deleteFile,
    getFileList
};
