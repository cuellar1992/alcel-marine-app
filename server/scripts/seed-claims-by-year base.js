/**
 * Script Template: Insert Claims by Year
 *
 * PURPOSE:
 * - Insert multiple Claims for a specific year
 * - Auto-generate Job Numbers with correct year format (ALCEL-YY-XXX)
 * - Maintain sequential numbering within the year (shared with Jobs)
 *
 * USAGE:
 * 1. Configure the year you want to insert data for
 * 2. Modify the claimsData array with your actual data
 * 3. Run: node server/scripts/seed-claims-by-year.js
 *
 * IMPORTANT:
 * - Make sure your .env file is configured with MONGODB_URI
 * - The script will automatically calculate the next available number for the year
 * - Job Numbers will be generated as: ALCEL-{year}-{sequential}
 * - The sequence is shared with Jobs (if last Job is ALCEL-24-005, next Claim will be ALCEL-24-006)
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Job from '../models/Job.js'
import Claim from '../models/Claim.js'

// Load environment variables
dotenv.config()

// ========================================
// CONFIGURATION - MODIFY THIS SECTION
// ========================================

// Set the year for which you want to insert claims (2-digit format: '23', '24', '25', etc.)
const TARGET_YEAR = '24' // Example: '24' for 2024

// Define your claims data here
const claimsData = [
  {
    clientName: 'Global Shipping Inc',
    subcontractName: 'Expert Surveyors Ltd',
    registrationDate: new Date('2024-02-10'),
    clientRef: 'GSI-2024-001',
    claimName: 'Cargo Damage - Container Ship',
    location: 'Puerto Cortes',
    siteInspectionDateTime: new Date('2024-02-12T09:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 8000,
    subcontractAmount: 3000,
    netProfit: 5000
  },
  {
    clientName: 'Ocean Insurance Co',
    subcontractName: '',
    registrationDate: new Date('2024-03-05'),
    clientRef: 'OIC-2024-015',
    claimName: 'Hull Damage Assessment',
    location: 'Puerto Castilla',
    siteInspectionDateTime: new Date('2024-03-07T14:00:00'),
    invoiceIssue: 'issued',
    invoiceAmount: 12000,
    subcontractAmount: 4500,
    netProfit: 7500
  },
  {
    clientName: 'Maritime Claims Ltd',
    subcontractName: 'Technical Inspectors SA',
    registrationDate: new Date('2024-04-15'),
    clientRef: 'MCL-2024-042',
    claimName: 'Machinery Breakdown',
    location: 'La Ceiba',
    siteInspectionDateTime: new Date('2024-04-18T10:30:00'),
    invoiceIssue: 'not-issued',
    invoiceAmount: 15000,
    subcontractAmount: 6000,
    netProfit: 9000
  }
  // Add more claims here as needed...
]

// ========================================
// SCRIPT LOGIC - DO NOT MODIFY UNLESS NECESSARY
// ========================================

/**
 * Get the next available job number for the specified year
 * (shared sequence with Jobs)
 */
const getNextJobNumber = async (year) => {
  try {
    // Validate year format
    if (!/^\d{2}$/.test(year)) {
      throw new Error('Year must be a 2-digit number (e.g., "23", "24", "25")')
    }

    // Create regex to match job numbers for the specific year
    const yearPattern = new RegExp(`^ALCEL-${year}-(\\d{3})$`)

    // Find all jobs and claims for this specific year
    const jobsForYear = await Job.find({
      jobNumber: { $regex: `^ALCEL-${year}-` }
    }).sort({ jobNumber: -1 }).limit(1)

    const claimsForYear = await Claim.find({
      jobNumber: { $regex: `^ALCEL-${year}-` }
    }).sort({ jobNumber: -1 }).limit(1)

    let nextNumber = 1

    // Extract number from latest job for this year
    if (jobsForYear.length > 0 && jobsForYear[0].jobNumber) {
      const jobMatch = jobsForYear[0].jobNumber.match(yearPattern)
      if (jobMatch) {
        nextNumber = Math.max(nextNumber, parseInt(jobMatch[1], 10) + 1)
      }
    }

    // Extract number from latest claim for this year
    if (claimsForYear.length > 0 && claimsForYear[0].jobNumber) {
      const claimMatch = claimsForYear[0].jobNumber.match(yearPattern)
      if (claimMatch) {
        nextNumber = Math.max(nextNumber, parseInt(claimMatch[1], 10) + 1)
      }
    }

    return nextNumber
  } catch (error) {
    throw new Error(`Error getting next job number: ${error.message}`)
  }
}

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message)
    process.exit(1)
  }
}

/**
 * Insert claims with auto-generated job numbers
 */
const seedClaims = async () => {
  try {
    console.log('\n🚀 Starting Claim Insertion Process...\n')
    console.log(`📅 Target Year: 20${TARGET_YEAR}`)
    console.log(`📊 Number of claims to insert: ${claimsData.length}\n`)

    // Get starting job number
    let currentNumber = await getNextJobNumber(TARGET_YEAR)
    console.log(`🔢 Starting from job number: ALCEL-${TARGET_YEAR}-${String(currentNumber).padStart(3, '0')}\n`)

    const insertedClaims = []

    // Insert each claim
    for (let i = 0; i < claimsData.length; i++) {
      const claimData = claimsData[i]

      // Generate job number
      const jobNumber = `ALCEL-${TARGET_YEAR}-${String(currentNumber).padStart(3, '0')}`

      // Create claim
      const claim = await Claim.create({
        ...claimData,
        jobNumber
      })

      insertedClaims.push(claim)
      console.log(`✅ [${i + 1}/${claimsData.length}] Created: ${jobNumber} - ${claim.claimName}`)

      // Increment for next claim
      currentNumber++
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ SUCCESS! All claims inserted successfully')
    console.log('='.repeat(60))
    console.log(`\n📊 Summary:`)
    console.log(`   - Year: 20${TARGET_YEAR}`)
    console.log(`   - Claims inserted: ${insertedClaims.length}`)
    console.log(`   - Job Numbers: ${insertedClaims[0].jobNumber} to ${insertedClaims[insertedClaims.length - 1].jobNumber}`)
    console.log(`   - Next available: ALCEL-${TARGET_YEAR}-${String(currentNumber).padStart(3, '0')}\n`)

  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    if (error.code === 11000) {
      console.error('   Duplicate job number detected. Job number already exists in database.')
    }
    process.exit(1)
  }
}

/**
 * Main execution
 */
const main = async () => {
  try {
    await connectDB()
    await seedClaims()

    // Disconnect from database
    await mongoose.connection.close()
    console.log('👋 Disconnected from MongoDB\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Fatal Error:', error.message)
    process.exit(1)
  }
}

// Run the script
main()
