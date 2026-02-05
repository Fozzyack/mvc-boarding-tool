import { drizzle } from "drizzle-orm/node-postgres";
import getConnectionString from "./getDbConnString";

const db = drizzle(getConnectionString())
export default db;
