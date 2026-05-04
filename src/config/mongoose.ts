import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    await mongoose.connect(mongoURI);

    console.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});
