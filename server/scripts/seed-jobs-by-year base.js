/**
 * Script Template: Insert Jobs by Year
 *
 * PURPOSE:
 * - Insert multiple Jobs for a specific year
 * - Auto-generate Job Numbers with correct year format (ALCEL-YY-XXX)
 * - Maintain sequential numbering within the year
 *
 * USAGE:
 * 1. Configure the year you want to insert data for
 * 2. Modify the jobsData array with your actual data
 * 3. Run: node server/scripts/seed-jobs-by-year.js
 *
 * IMPORTANT:
 * - Make sure your .env file is configured with MONGODB_URI
 * - The script will automatically calculate the next available number for the year
 * - Job Numbers will be generated as: ALCEL-{year}-{sequential}
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

// Set the year for which you want to insert jobs (2-digit format: '23', '24', '25', etc.)
const TARGET_YEAR = '24' // Example: '24' for 2024

// Define your jobs data here
const jobsData = [
  {
    vesselName: 'Ocean Voyager',
    dateTime: new Date('2024-03-15T08:00:00'),
    etb: new Date('2024-03-15T06:00:00'),
    etd: new Date('2024-03-15T18:00:00'),
    port: 'Puerto Cortes',
    jobType: 'Ballast Water Survey',
    clientName: 'Maritima Internacional',
    subcontractName: 'Subcontractor A',
    invoiceIssue: 'paid',
    invoiceAmount: 5000,
    subcontractAmount: 2000,
    netProfit: 3000,
    status: 'completed',
    remark: 'Job completed successfully'
  },
  {
    vesselName: 'Pacific Star',
    dateTime: new Date('2024-04-20T10:00:00'),
    etb: new Date('2024-04-20T08:00:00'),
    etd: new Date('2024-04-20T20:00:00'),
    port: 'Puerto Castilla',
    jobType: 'Bunker Survey',
    clientName: 'Shipping Solutions Ltd',
    subcontractName: '',
    invoiceIssue: 'issued',
    invoiceAmount: 4500,
    subcontractAmount: 1500,
    netProfit: 3000,
    status: 'completed',
    remark: 'Routine bunker survey'
  },
  {
    vesselName: 'Atlantic Glory',
    dateTime: new Date('2024-05-10T14:00:00'),
    etb: new Date('2024-05-10T12:00:00'),
    etd: new Date('2024-05-11T06:00:00'),
    port: 'Puerto Cortes',
    jobType: 'Draft Survey',
    clientName: 'Ocean Freight Co',
    subcontractName: 'Subcontractor B',
    invoiceIssue: 'not-issued',
    invoiceAmount: 6000,
    subcontractAmount: 2500,
    netProfit: 3500,
    status: 'in-progress',
    remark: 'Draft survey for cargo verification'
  }
  // Add more jobs here as needed...
]

// ========================================
// SCRIPT LOGIC - DO NOT MODIFY UNLESS NECESSARY
// ========================================

/**
 * Get the next available job number for the specified year
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
 * Insert jobs with auto-generated job numbers
 */
const seedJobs = async () => {
  try {
    console.log('\n🚀 Starting Job Insertion Process...\n')
    console.log(`📅 Target Year: 20${TARGET_YEAR}`)
    console.log(`📊 Number of jobs to insert: ${jobsData.length}\n`)

    // Get starting job number
    let currentNumber = await getNextJobNumber(TARGET_YEAR)
    console.log(`🔢 Starting from job number: ALCEL-${TARGET_YEAR}-${String(currentNumber).padStart(3, '0')}\n`)

    const insertedJobs = []

    // Insert each job
    for (let i = 0; i < jobsData.length; i++) {
      const jobData = jobsData[i]

      // Generate job number
      const jobNumber = `ALCEL-${TARGET_YEAR}-${String(currentNumber).padStart(3, '0')}`

      // Create job
      const job = await Job.create({
        ...jobData,
        jobNumber
      })

      insertedJobs.push(job)
      console.log(`✅ [${i + 1}/${jobsData.length}] Created: ${jobNumber} - ${job.vesselName}`)

      // Increment for next job
      currentNumber++
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ SUCCESS! All jobs inserted successfully')
    console.log('='.repeat(60))
    console.log(`\n📊 Summary:`)
    console.log(`   - Year: 20${TARGET_YEAR}`)
    console.log(`   - Jobs inserted: ${insertedJobs.length}`)
    console.log(`   - Job Numbers: ${insertedJobs[0].jobNumber} to ${insertedJobs[insertedJobs.length - 1].jobNumber}`)
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
    await seedJobs()

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
