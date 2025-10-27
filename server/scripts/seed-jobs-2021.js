/**
 * Script: Insert Jobs for Year 2021
 * 
 * Generated from: Alcel_Marine_Jobs_2021.xlsx
 * Total Jobs: 2
 * 
 * USAGE:
 * 1. Copy this file to: server/scripts/seed-jobs-by-year.js
 * 2. Make sure your .env file has MONGODB_URI configured
 * 3. Run: node server/scripts/seed-jobs-by-year.js
 * 
 * CONFIGURATION:
 * - Year: 2021
 * - Date & Time: From Excel data + 08:00 hours
 * - ETB: Same as Date & Time (08:00)
 * - ETD: One day after ETB at 08:00
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Job from '../models/Job.js'
import Claim from '../models/Claim.js'

dotenv.config()

const TARGET_YEAR = '21' // Year 2021

const jobsData = [
  {
    vesselName: 'Alam Kukuh',
    dateTime: new Date('2021-12-16T08:00:00'),
    etb: new Date('2021-12-16T08:00:00'),
    etd: new Date('2021-12-17T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 500,
    subcontractAmount: 200,
    netProfit: 300,
    status: 'completed',
    remark: ''
  },
  {
    vesselName: 'Seamelody',
    dateTime: new Date('2021-12-16T08:00:00'),
    etb: new Date('2021-12-16T08:00:00'),
    etd: new Date('2021-12-17T08:00:00'),
    port: 'Newcastle',
    jobType: 'Ballast',
    clientName: 'Tribocare',
    subcontractName: '',
    invoiceIssue: 'paid',
    invoiceAmount: 650,
    subcontractAmount: 200,
    netProfit: 450,
    status: 'completed',
    remark: ''
  }]

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
