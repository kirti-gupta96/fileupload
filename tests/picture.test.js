const fs = require('fs');
const { uploadFile, getFileById, getFileList, updateFile, deleteFile } = require('../controllers/picture.controller');
const Pictures = require('../db/schemas/pictures.schema.js');

jest.mock('fs');
jest.mock('../db/schemas/pictures.schema.js');
jest.mock('../utils/generateId', () => {
    return {
        generateId: jest.fn().mockReturnValue("pc-123")
    }
});

describe('uploadFile function', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn()
    };

    test('should handle no file uploaded', async () => {
        let req = {
            file: null
        }
        await uploadFile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('No file uploaded.');
    });

    test('should upload file successfully', async () => {
        const req = {
            file: {
                originalFileName: 'example.jpg',
                path: '/path/to/file',
                mimetype: 'image/jpeg'
            },
            body: {
                description: 'Example description'
            }
        };

        Pictures.create.mockResolvedValue({
            fileId: "pc-123"
        });

        fs.readFileSync.mockReturnValue(Buffer.from('mockImageData'));
        await uploadFile(req, res);

        expect(Pictures.create).toHaveBeenCalledWith({
            description: req.body.description,
            fileId: "pc-123",
            fileData: expect.any(Buffer),
            contentType: req.file.mimetype,
            fileName: req.file.originalFileName
        });

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Picture uploaded successfully',
            fileId: "pc-123"
        });
    });

    test('should handle errors', async () => {
        const req = {
            file: {
                originalFileName: 'example.jpg',
                path: '/path/to/file',
                mimetype: 'image/jpeg'
            },
            body: {
                description: 'Example description'
            }
        };

        const mockError = new Error('Something went wrong');
        try {
            Pictures.create.mockRejectedValue(mockError);
            await uploadFile(req, res);
        } catch (error) {
            expect(error.message).toEqual("Something went wrong");
        }
    });
});

describe('getFileById function', () => {
    const req = {
        params: {
            fileId: "pc-123"
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn()
    };

    test('should get file details for fileId', async () => {
        const mockResult = {
            fileId: "pc-123",
            description: "a cat pic",
            fileData: expect.any(Buffer),
            contentType: "image/jpeg",
            fileName: "example.jpg"
        };

        Pictures.findOne.mockResolvedValue(mockResult);
        await getFileById(req, res);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    test("should throw error when fileId doesn't exists", async () => {
        try {
            Pictures.findOne.mockResolvedValue(null);
            await getFileById(req, res);
        } catch (error) {
            expect(error.message).toEqual("Data doesn't exists");
        }

    });
});

describe('updateFile function', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn()
    };
    test('should update file successfully', async () => {
        const req = {
            file: {
                originalFileName: 'example.jpg',
                path: '/path/to/file',
                mimetype: 'image/jpeg'
            },
            body: {
                description: 'New description'
            },
            params: {
                fileId: "pc-123"
            }
        };


        Pictures.updateOne.mockResolvedValue({
            fileId: "pc-123"
        });

        fs.readFileSync.mockReturnValue(Buffer.from('mockImageData'));
        await updateFile(req, res);

        expect(Pictures.updateOne).toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith({ success: true, message: "Updated successfully" });
    });

    test('should handle improper request errors', async () => {
        const req = {
            file: {
                originalFileName: 'example.jpg',
                path: '/path/to/file',
                mimetype: 'image/jpeg'
            },
            params: {
                fileId: "pc-123"
            }
        };

        try {
            await updateFile(req, res);
        } catch (error) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(error.message).toEqual("Request is not proper");
        }

    });

    test('should handle errors when fileId not present', async () => {
        const req = {
            file: {
                originalFileName: 'example.jpg',
                path: '/path/to/file',
                mimetype: 'image/jpeg'
            },
            params: {}
        };

        try {
            await updateFile(req, res);
        } catch (error) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(error.message).toEqual("File Id not present");
        }

    });
});

describe('deleteFile function', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn()
    };
    test('should delete file successfully', async () => {
        const req = {
            file: {
                originalFileName: 'example.jpg',
                path: '/path/to/file',
                mimetype: 'image/jpeg'
            },
            body: {
                description: 'New description'
            },
            params: {
                fileId: "pc-123"
            }
        };

        Pictures.findOne.mockResolvedValue({
            fileId: "pc-123",
            description: "a cat pic",
            fileData: expect.any(Buffer),
            contentType: "image/jpeg",
            fileName: "example.jpg"
        });
        Pictures.updateOne.mockResolvedValue({
            fileId: "pc-123"
        });

        fs.readFileSync.mockReturnValue(Buffer.from('mockImageData'));
        await deleteFile(req, res);
        expect(Pictures.updateOne).toHaveBeenCalledWith({ fileId: "pc-123" }, { $set: { deletedAt: new Date() } });
        expect(res.json).toHaveBeenCalledWith({ success: true, message: "Delete successfully" });
    });

    test('should handle errors when fileId not present', async () => {
        const req = {
            file: {
                originalFileName: 'example.jpg',
                path: '/path/to/file',
                mimetype: 'image/jpeg'
            },
            params: {
                fileId: "pc-123"
            }
        };

        try {
            Pictures.findOne.mockResolvedValue(null);
            await deleteFile(req, res);
        } catch (error) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(error.message).toEqual("Data doesn't exists");
        }

    });

    test('should handle errors when fileId not present', async () => {
        const req = {
            file: {
                originalFileName: 'example.jpg',
                path: '/path/to/file',
                mimetype: 'image/jpeg'
            },
            params: {}
        };

        try {
            await deleteFile(req, res);
        } catch (error) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(error.message).toEqual("File Id not present");
        }

    });
});

describe('getFileList function', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn()
    };
    test('should get file list successfully', async () => {
        const req = {
            query: {
                skip: 0,
                limit: 1
            }
        };

        const page = {
            skip: 0,
            limit: 1
        }

        const mockResult = [{
            fileId: "pc-123",
            description: "a cat pic",
            fileData: expect.any(Buffer),
            contentType: "image/jpeg",
            fileName: "example.jpg"
        }];

        Pictures.find.mockResolvedValue(mockResult);
        Pictures.countDocuments.mockResolvedValue(5);
        fs.readFileSync.mockReturnValue(Buffer.from('mockImageData'));
        await getFileList(req, res);
        expect(Pictures.find).toHaveBeenCalledWith({ deletedAt: { $exists: false } }, {}, page);
        expect(res.json).toHaveBeenCalledWith({
            result: mockResult,
            total: 5,
            moreAvailable: true
        });
    });

    test('should handle errors when file data is not present', async () => {
        const req = {
            query: {
                skip: 0,
                limit: 1
            }
        };

        try {
            Pictures.find.mockResolvedValue(null);
            await getFileList(req, res);
        } catch (error) {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(error.message).toEqual("Data doesn't exists");
        }

    });

    test('should handle errors', async () => {
        const req = {
            query: {
                skip: 0,
                limit: 1
            }
        };
        const mockError = new Error('Something went wrong');
        try {
            Pictures.find.mockRejectedValue(mockError);
            await getFileList(req, res);
        } catch (error) {
            expect(error.message).toEqual("Something went wrong");
        }

    });
});

