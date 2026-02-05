import { defineConfig } from 'drizzle-kit'
import getConnectionString from './utils/db/getDbConnString'

export default defineConfig({
    out: './drizzle-migrations',
    schema: './utils/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: getConnectionString()
    }
})
