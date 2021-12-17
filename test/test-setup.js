const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;


async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
}

async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            if (error.message === 'ns not found') return
            if (error.message.includes('a background operation is currently running')) return
            console.log(error.message);
        }
    }
}

module.exports = {
    setupDB () {
        // Connect to Mongoose
        beforeAll(async () => {
            const url = process.env.MONGO_URL_TEST;
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });
        })

        // Cleans up database between each test
        afterEach(async () => {
            await removeAllCollections();
        })

        // Disconnect Mongoose
        afterAll(async () => {
            await dropAllCollections();
            await mongoose.connection.close();
        })
    }
}