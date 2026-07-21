import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

async function syncDb() {
  console.log('Connecting to PostgreSQL and syncing schema...')
  // Force development mode during sync script so Payload Drizzle schema push executes
  ;(process.env as Record<string, string>).NODE_ENV = 'development'
  const payload = await getPayload({ config })

  try {
    await payload.db.drizzle.execute(
      `ALTER TABLE payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_parent_fk;
       ALTER TABLE payload_preferences_rels ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES payload_preferences(id) ON DELETE CASCADE;
       ALTER TABLE payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_admins_fk;
       ALTER TABLE payload_preferences_rels ADD CONSTRAINT payload_preferences_rels_admins_fk FOREIGN KEY (admins_id) REFERENCES admins(id) ON DELETE CASCADE;
       ALTER TABLE payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_clients_fk;
       ALTER TABLE payload_preferences_rels ADD CONSTRAINT payload_preferences_rels_clients_fk FOREIGN KEY (clients_id) REFERENCES clients(id) ON DELETE CASCADE;`
    )
    console.log('✓ Database CASCADE foreign key constraints applied successfully!')
  } catch (err) {
    console.warn('Warning applying CASCADE constraints:', err)
  }

  console.log('✓ Database schema synced successfully!')
  process.exit(0)
}

syncDb().catch((err) => {
  console.error('Failed to sync database:', err)
  process.exit(1)
})
