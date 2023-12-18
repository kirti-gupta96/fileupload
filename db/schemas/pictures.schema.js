const mongoose = require("mongoose");

const PicturesSchema = new mongoose.Schema({
    fileId: {
        type: String,
        unique: true
    },
    fileName: {
        type: String,
        // required: true
    },
    contentType: {
        type: String,
        required: true
    },
    fileData: {
        type: Buffer,
        required: true
    },
    description: {
        type: String
    },
    deletedAt: {
        type: Date
    }
},
    {
        timestamps: true,
        collection: 'pictures',
    }
);

const Pictures = mongoose.model("pictures", PicturesSchema);

module.exports = Pictures;