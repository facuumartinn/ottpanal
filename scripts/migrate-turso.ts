import { createClient } from '@libsql/client'
import fs from 'fs'
import path from 'path'

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
  process.exit(1)
}

const client = createClient({ url, authToken })

async function migrate() {
  const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations', '20260625141348_init', 'migration.sql')
  const sql = fs.readFileSync(migrationsPath, 'utf-8')
  
  const statements = sql.split(';').filter(s => s.trim().length > 0)
  
  for (const statement of statements) {
    try {
      await client.execute(statement)
    } catch (error) {
      console.error('Error executing statement:', statement.substring(0, 100))
      console.error(error)
    }
  }
  
  console.log('Migration completed successfully')
  await client.close()
}

migrate().catch(console.error)
