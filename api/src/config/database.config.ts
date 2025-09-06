import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private client: MongoClient;
    private db: Db;
    private logger = new Logger('DatabaseService');

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        const mongodbUri = this.configService.get<string>('database.mongodbUri') ?? 'mongodb://127.0.0.1:27017/react_auth_course?retryWrites=true';
        const databaseName = this.configService.get<string>('database.mongodbDatabaseName') ?? 'react_auth_course';

        try {
            this.client = new MongoClient(mongodbUri, {
                maxConnecting: this.configService.get<number>('database.databaseConnectionLimit') ?? 10,
                connectTimeoutMS: this.configService.get<number>('database.databaseConnectionIdleTimeout') ?? 10000,
                serverSelectionTimeoutMS: 5000,
            });
            await this.client.connect();
            this.db = this.client.db(databaseName);
            this.logger.log(`✅ Connected to MongoDB database: ${databaseName}`);
        } catch (error) {
            this.logger.error('❌ Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.close();
            this.logger.log('✅ Disconnected from MongoDB');
        }
    }

    getDatabase(): Db {
        if (!this.db) {
            throw new Error('❌ Database not initialized');
        }
        return this.db;
    }

    getClient(): MongoClient {
        if (!this.client) {
            throw new Error('❌ MongoDB client not initialized');
        }
        return this.client;
    }
}
