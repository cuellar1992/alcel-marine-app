/**
 * Clear Test Data Script
 * Deletes Jobs (Marine Non-Claims) and Claims (Marine Claims) quickly.
 *
 * Usage:
 *   node server/scripts/clear-test-data.js --yes
 *   node server/scripts/clear-test-data.js --yes --only=jobs
 *   node server/scripts/clear-test-data.js --yes --only=claims
 *
 * Safety:
 * - Requires --yes flag (or env ALLOW_CLEAR=1) to execute.
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mongoose from 'mongoose'
import connectDB from '../config/database.js'
import Job from '../models/Job.js'
import Claim from '../models/Claim.js'

// Resolve .env path (script is in server/scripts → env is in server/.env)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env') })

const args = process.argv.slice(2)
const allow = args.includes('--yes') || process.env.ALLOW_CLEAR === '1'
const onlyArg = args.find(arg => arg.startsWith('--only='))
const only = onlyArg ? onlyArg.split('=')[1] : null

if (!allow) {
  console.error('❌ Falta confirmación. Ejecuta con --yes (o ALLOW_CLEAR=1)')
  console.error('   Ejemplos:')
  console.error('   node server/scripts/clear-test-data.js --yes')
  console.error('   node server/scripts/clear-test-data.js --yes --only=jobs')
  console.error('   node server/scripts/clear-test-data.js --yes --only=claims')
  process.exit(1)
}

if (only && only !== 'jobs' && only !== 'claims') {
  console.error('❌ Valor inválido para --only. Use: jobs | claims')
  process.exit(1)
}

async function run() {
  try {
    await connectDB()

    let jobsResult = null
    let claimsResult = null

    if (!only || only === 'jobs') {
      jobsResult = await Job.deleteMany({})
      console.log(`🗑️  Jobs eliminados: ${jobsResult.deletedCount}`)
    }

    if (!only || only === 'claims') {
      claimsResult = await Claim.deleteMany({})
      console.log(`🗑️  Claims eliminados: ${claimsResult.deletedCount}`)
    }

    console.log('✅ Limpieza completada')
  } catch (err) {
    console.error('❌ Error al borrar datos:', err.message)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
    process.exit()
  }
}

run()




