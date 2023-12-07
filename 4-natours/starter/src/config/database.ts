import mongoose from 'mongoose';

export class DatabaseConfig {
  MONGO_DB_URI: string = String(process.env.MONGO_URI);

  MONGO_DB_PASSWORD: string = String(process.env.MONGO_PASSWORD);

  MONGO_DATABASE_NAME: string = String(process.env.MONGO_DB_NAME);

  async connectToDB() {
    try {
      const DB_URI: string = this.MONGO_DB_URI.replace('<PASSWORD>', this.MONGO_DB_PASSWORD);
      return await mongoose.connect(DB_URI, {
        dbName: this.MONGO_DATABASE_NAME,
      });
    } catch (error) {
      throw new Error('Failed to connect to DB');
    }
  }

  async disconnectDB() {
    try {
      return await mongoose.disconnect();
    } catch (error) {
      throw new Error('Failed to disconnect from DB');
    }
  }
}
