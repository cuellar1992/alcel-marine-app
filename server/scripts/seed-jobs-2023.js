/**
 * Script: Insert Jobs for Year 2023
 * 
 * Generated from: Alcel_Marine_Jobs_2023.xlsx
 * Total Jobs: 18
 * 
 * USAGE:
 * 1. Copy this file to: server/scripts/seed-jobs-by-year.js
 * 2. Make sure your .env file has MONGODB_URI configured
 * 3. Run: node server/scripts/seed-jobs-by-year.js
 * 
 * CONFIGURATION:
 * - Year: 2023
 * - Date & Time: From Excel data + 08:00 hours
 * - ETB: Same as Date & Time (08:00)
 * - ETD: One day after ETB at 08:00
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
const TARGET_YEAR = '23' // Year 2023

// Define your jobs data here
const jobsData = [
  {
    vesselName: 'Keta',
    dateTime: new Date('2023-04-20T08:00:00'),
    etb: new Date('2023-04-20T08:00:00'),
    etd: new Date('2023-04-21T08:00:00'),
    port: 'SYD',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 600,
    subcontractAmount: 200,
    netProfit: 400,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Santa Johanna',
    dateTime: new Date('2023-03-10T08:00:00'),
    etb: new Date('2023-03-10T08:00:00'),
    etd: new Date('2023-03-11T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'St Aidan',
    dateTime: new Date('2023-03-27T08:00:00'),
    etb: new Date('2023-03-27T08:00:00'),
    etd: new Date('2023-03-28T08:00:00'),
    port: 'Port Kembla',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 600,
    subcontractAmount: 200,
    netProfit: 400,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Arch Sealtiel',
    dateTime: new Date('2023-02-17T08:00:00'),
    etb: new Date('2023-02-17T08:00:00'),
    etd: new Date('2023-02-18T08:00:00'),
    port: 'Port Kembla',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 600,
    subcontractAmount: 200,
    netProfit: 400,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Bunsun Power',
    dateTime: new Date('2023-05-01T08:00:00'),
    etb: new Date('2023-05-01T08:00:00'),
    etd: new Date('2023-05-02T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 700,
    subcontractAmount: 200,
    netProfit: 500,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Lady Bellamelia',
    dateTime: new Date('2023-05-08T08:00:00'),
    etb: new Date('2023-05-08T08:00:00'),
    etd: new Date('2023-05-09T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Belle Mer',
    dateTime: new Date('2023-05-09T08:00:00'),
    etb: new Date('2023-05-09T08:00:00'),
    etd: new Date('2023-05-10T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Irene II',
    dateTime: new Date('2023-06-04T08:00:00'),
    etb: new Date('2023-06-04T08:00:00'),
    etd: new Date('2023-06-05T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Evergrace',
    dateTime: new Date('2023-06-14T08:00:00'),
    etb: new Date('2023-06-14T08:00:00'),
    etd: new Date('2023-06-15T08:00:00'),
    port: 'Port Kembla',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 700,
    subcontractAmount: 200,
    netProfit: 500,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Kaiyo',
    dateTime: new Date('2023-06-16T08:00:00'),
    etb: new Date('2023-06-16T08:00:00'),
    etd: new Date('2023-06-17T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Conrord Oldendorff',
    dateTime: new Date('2023-06-20T08:00:00'),
    etb: new Date('2023-06-20T08:00:00'),
    etd: new Date('2023-06-21T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Morning Cloud',
    dateTime: new Date('2023-06-26T08:00:00'),
    etb: new Date('2023-06-26T08:00:00'),
    etd: new Date('2023-06-27T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Lanna Naree',
    dateTime: new Date('2023-07-07T08:00:00'),
    etb: new Date('2023-07-07T08:00:00'),
    etd: new Date('2023-07-08T08:00:00'),
    port: 'Port Kembla',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 700,
    subcontractAmount: 200,
    netProfit: 500,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Pacific Naviska',
    dateTime: new Date('2023-07-08T08:00:00'),
    etb: new Date('2023-07-08T08:00:00'),
    etd: new Date('2023-07-09T08:00:00'),
    port: 'Port Kembla',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 600,
    subcontractAmount: 200,
    netProfit: 400,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Desert Glory',
    dateTime: new Date('2023-09-07T08:00:00'),
    etb: new Date('2023-09-07T08:00:00'),
    etd: new Date('2023-09-08T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Mercury Leader',
    dateTime: new Date('2023-09-22T08:00:00'),
    etb: new Date('2023-09-22T08:00:00'),
    etd: new Date('2023-09-23T08:00:00'),
    port: 'Port Kembla',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 700,
    subcontractAmount: 200,
    netProfit: 500,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Satori',
    dateTime: new Date('2023-10-14T08:00:00'),
    etb: new Date('2023-10-14T08:00:00'),
    etd: new Date('2023-10-15T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'IAN M',
    dateTime: new Date('2023-06-21T08:00:00'),
    etb: new Date('2023-06-21T08:00:00'),
    etd: new Date('2023-06-22T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 750,
    subcontractAmount: 200,
    netProfit: 550,
    status: 'completed',
    remark: ''
  }]

// ========================================
// SCRIPT LOGIC - DO NOT MODIFY UNLESS NECESSARY
// ========================================

/**
 * Get the next available job number for the specified year
 * (shared sequence with Claims)
 */
const getNextJobNumber = async (year) => {
  try {
    if (!/^\d{2}$/.test(year)) {
      throw new Error('Year must be a 2-digit number (e.g., "23", "24", "25")')
    }

    const yearPattern = new RegExp(`^ALCEL-${year}-(\\d{3})$`)

    const jobsForYear = await Job.find({
      jobNumber: { $regex: `^ALCEL-${year}-` }
    }).sort({ jobNumber: -1 }).limit(1)

    const claimsForYear = await Claim.find({
      jobNumber: { $regex: `^ALCEL-${year}-` }
    }).sort({ jobNumber: -1 }).limit(1)

    let nextNumber = 1

    if (jobsForYear.length > 0 && jobsForYear[0].jobNumber) {
      const jobMatch = jobsForYear[0].jobNumber.match(yearPattern)
      if (jobMatch) {
        nextNumber = Math.max(nextNumber, parseInt(jobMatch[1], 10) + 1)
      }
    }

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

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message)
    process.exit(1)
  }
}

const seedJobs = async () => {
  try {
    console.log('\n🚀 Starting Job Insertion Process...\n')
    console.log(`📅 Target Year: 20${TARGET_YEAR}`)
    console.log(`📊 Number of jobs to insert: ${jobsData.length}\n`)

    let currentNumber = await getNextJobNumber(TARGET_YEAR)
    console.log(`🔢 Starting from job number: ALCEL-${TARGET_YEAR}-${String(currentNumber).padStart(3, '0')}\n`)

    const insertedJobs = []

    for (let i = 0; i < jobsData.length; i++) {
      const jobData = jobsData[i]
      const jobNumber = `ALCEL-${TARGET_YEAR}-${String(currentNumber).padStart(3, '0')}`

      const job = await Job.create({
        ...jobData,
        jobNumber
      })

      insertedJobs.push(job)
      console.log(`✅ [${i + 1}/${jobsData.length}] Created: ${jobNumber} - ${job.vesselName}`)
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

const main = async () => {
  try {
    await connectDB()
    await seedJobs()
    await mongoose.connection.close()
    console.log('👋 Disconnected from MongoDB\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Fatal Error:', error.message)
    process.exit(1)
  }
}

main()
