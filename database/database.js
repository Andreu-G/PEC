const mongoose = require("mongoose");

const { MONGO_USER, MONGO_PWD, MONGO_HOST, MONGO_DB } = process.env;
const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`

exports.connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB connected on ${MONGO_DB} database`);
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};