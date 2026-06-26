import { PrismaClient } from '../generated/prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  
  if (url && authToken) {
    const libsql = createClient({ 
      url,
      authToken 
    })
    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter })
  }
  
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  const libsql = createClient({ url: `file:${dbPath}` })
  const adapter = new PrismaLibSQL(libsql)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
