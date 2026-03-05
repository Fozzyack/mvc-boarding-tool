import { defineConfig } from 'drizzle-kit'
import getConnectionString from './db/getDbConnString'

export default defineConfig({
    out: './drizzle-migrations',
    schema: './db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: getConnectionString()
    }
})
