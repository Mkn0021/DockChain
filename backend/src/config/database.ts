import { env } from './env';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import type { CachedConnection, MongoConnection } from '../types/database.type';


const cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectDB(): MongoConnection {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000
        };

        cached.promise = mongoose.connect(env.MONGODB_URI, opts).then((mongoose) => {
            return mongoose.connection;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`✅ MongoDB Connected: ${cached.conn.host}`);
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

export function isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
}

export const mongoClient = new MongoClient(env.MONGODB_URI);