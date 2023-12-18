const mongoose = require('mongoose');

async function connectToMongoDB() {
    try {
        const url = 'mongodb://localhost:27017/mydatabase';

        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }

        mongoose.connect(url, connectionParams)
            .then(() => {
                console.log('Connected to the database ')
            })
            .catch((err) => {
                console.error(`Error connecting to the database. n${err}`);
            })

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToMongoDB;