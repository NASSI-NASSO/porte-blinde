import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { getServerEnv } from "@/lib/serverEnv";

const connectionString = getServerEnv("DATABASE_URL");

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Create the connection pool
const poolConnection = mysql.createPool(connectionString);

// Export the drizzle instance
export const db = drizzle(poolConnection, { schema, mode: "default" });
