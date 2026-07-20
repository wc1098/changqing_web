import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

async function syncDb() {
  console.log('Connecting to PostgreSQL and syncing schema...')
  // Force development mode during sync script so Payload Drizzle schema push executes
  ;(process.env as any).NODE_ENV = 'development'
  const payload = await getPayload({ config })
  console.log('✓ Database schema synced successfully!')
  process.exit(0)
}

syncDb().catch((err) => {
  console.error('Failed to sync database:', err)
  process.exit(1)
})
