import type { Connection } from "mongoose";


declare global {
    var mongoose: CachedConnection | undefined;
}

export interface CachedConnection {
    conn: Connection | null;
    promise: Promise<Connection> | null;
}


export type MongoConnection = Promise<Connection>;
