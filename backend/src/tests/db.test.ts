import mongoose from "mongoose";
import { connectDB, isMongoConnected } from "../config/database";

type MongoConnection = mongoose.Connection;

describe('MongoDB Connection', () => {
    let connection: MongoConnection;

    it('should connect to MongoDB', async () => {
        connection = await connectDB();
        expect(connection).toBeDefined();
        expect(isMongoConnected()).toBe(true);
    });

    it('should return the same connection if called again', async () => {
        const secondConnection = await connectDB();
        expect(secondConnection).toBe(connection);
    });
});
