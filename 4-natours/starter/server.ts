import dotenv from 'dotenv';
import { Error } from 'mongoose';
import { App } from './src/app';
import { DatabaseConfig } from './src/config/database';

class Server {
  private app: App;

  constructor() {
    dotenv.config({ path: '.env.prod' });
    this.app = new App();
  }

  private async connectDB() {
    try {
      if (process.env.NODE_ENV !== 'production') {
        await new DatabaseConfig().connectToLocalDB();
        console.log('Connected to the local database');
      } else {
        await new DatabaseConfig().connectToDB();
        console.log('Connected to the database');
      }
    } catch (error) {
      console.error('Error connecting to the database:', (error as Error).message);
      process.exit(1);
    }
  }

  async start() {
    const port = Number(process.env.PORT) || 3000;
    await this.connectDB();
    this.app.start(port);
  }
}

const server = new Server();
server.start();
