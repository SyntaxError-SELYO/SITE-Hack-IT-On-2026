const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            console.warn('MONGO_URI is missing in .env file, getting ready to fall back...');
        } else {
            // Connect to MongoDB Atlas, force IPv4 (family: 4)
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000, // 5s timeout
                family: 4, // force IPv4
            });

            console.log(`MongoDB Connected: ${conn.connection.host}`);
            await createDefaultAdmin();
            return;
        }
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Ensure strictly disconnected before retrying
        try { await mongoose.disconnect(); } catch (e) { }
        console.log('Falling back to in-memory MongoDB for development...');
    }

    try {
        // Use in-memory MongoDB for development
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();

        const conn = await mongoose.connect(memoryUri);
        console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
        console.log('⚠️  Data will not persist after server restart!');

        await createDefaultAdmin();

    } catch (memError) {
        console.error('Failed to start in-memory MongoDB:', memError.message);
        process.exit(1);
    }
};

const createDefaultAdmin = async () => {
    const User = require('../models/User');
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (!existingAdmin) {
        await User.create({
            name: 'Registrar Admin',
            email: 'admin@selyo.edu',
            password: 'admin123', // later you can hash this
            role: 'admin',
            studentId: 'ADMIN-001',
        });
        console.log('Default admin created: admin@selyo.edu / admin123');
    }
};

module.exports = connectDB;
