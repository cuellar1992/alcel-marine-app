/**
 * Script: Insert Claims for Year 2025
 * 
 * Generated from: Copy_of_Alcel_Marine_Claims_2025-10-25.xlsx
 * Total Claims: 33
 * 
 * USAGE:
 * 1. Copy this file to: server/scripts/seed-claims-by-year.js
 * 2. Make sure your .env file has MONGODB_URI configured
 * 3. Run: node server/scripts/seed-claims-by-year.js
 * 
 * CONFIGURATION:
 * - Year: 2025
 * - Invoice Status: paid (for all)
 * - Invoice Amount: $1,000 (for all)
 * - Subcontract Amount: $200 (for all)
 * - Net Profit: $800 (for all)
 * - Site Inspection: Same date as Registration Date at 00:00
 * - Client Ref Normalization: Empty values → 'N/A'
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
const TARGET_YEAR = '25' // Year 2025

// Define your claims data here
const claimsData = [
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-02-03'),
    clientRef: '520/60/06885/C',
    claimName: 'tetra-Pak',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-02-03T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'Yarra Marine',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-03-25'),
    clientRef: 'Yarra Marine',
    claimName: 'DP World',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-03-25T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'Wiseway Logistics',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-05-09'),
    clientRef: '', // Will be normalized to 'N/A'
    claimName: 'Wiseway Logistics',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-05-09T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'Yarra Marine',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-06-11'),
    clientRef: 'Yarra Marine',
    claimName: 'Simplot Australia',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-06-11T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Dusnford',
    registrationDate: new Date('2025-04-22'),
    clientRef: '555/60/12930',
    claimName: 'Nestle',
    location: 'Auckland',
    siteInspectionDateTime: new Date('2025-04-22T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-05-14'),
    clientRef: '540/60/19016/C',
    claimName: 'CPF Australia / Spring Rolls',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-05-14T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-06-12'),
    clientRef: '', // Will be normalized to 'N/A'
    claimName: 'Dr. Oetker',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-06-12T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-06-23'),
    clientRef: '', // Will be normalized to 'N/A'
    claimName: 'CPF Australia / Mango sticky rice',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-06-23T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Orion Nautical',
    registrationDate: new Date('2025-07-01'),
    clientRef: '565/60/24831',
    claimName: 'Grasim Industries - MEDUVO359644',
    location: 'Perth',
    siteInspectionDateTime: new Date('2025-07-01T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Orion Nautical',
    registrationDate: new Date('2025-07-01'),
    clientRef: '565/60/26006',
    claimName: 'Grasim Industries - MEDUVO554038',
    location: 'Perth',
    siteInspectionDateTime: new Date('2025-07-01T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'Yarra Marine',
    subcontractName: 'Armada Maritime',
    registrationDate: new Date('2025-07-15'),
    clientRef: 'Yarra Marine',
    claimName: 'Pop Frenzy & Quinn',
    location: 'Adelaide',
    siteInspectionDateTime: new Date('2025-07-15T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Syd',
    registrationDate: new Date('2025-07-16'),
    clientRef: '529/6025420/C',
    claimName: 'Unilever AU',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-07-16T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Naj Consultants',
    registrationDate: new Date('2025-07-24'),
    clientRef: '555/60/28031',
    claimName: 'Nestle Inland Loss',
    location: 'Brisbane',
    siteInspectionDateTime: new Date('2025-07-24T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-07-31'),
    clientRef: '565/6028720/C',
    claimName: 'Xtrovert Global OPC Pvt Ltd',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-07-31T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Orion Nautical',
    registrationDate: new Date('2025-07-31'),
    clientRef: '267/6028914',
    claimName: 'Diageo Australia',
    location: 'Perth',
    siteInspectionDateTime: new Date('2025-07-31T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-08-04'),
    clientRef: '565/6029270/C',
    claimName: 'Rivaan Technologies',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-08-04T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-08-11'),
    clientRef: '542/60/30119/C',
    claimName: 'IBM',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-08-11T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-08-14'),
    clientRef: ':565/6029034/C',
    claimName: 'Arun International',
    location: 'Hastings',
    siteInspectionDateTime: new Date('2025-08-14T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-08-29'),
    clientRef: '555/60/32945',
    claimName: 'Nestle - Pet food',
    location: 'Bathurst',
    siteInspectionDateTime: new Date('2025-08-29T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-09-04'),
    clientRef: '529/60/23570/C',
    claimName: 'Unilever AU',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-09-04T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-09-08'),
    clientRef: '586/60/34241/C',
    claimName: 'RECKITT BENCKISER',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-09-08T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-09-23'),
    clientRef: '565/60/36521/C',
    claimName: 'Vrundawan',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-09-23T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'ISA',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-10-03'),
    clientRef: '', // Will be normalized to 'N/A'
    claimName: 'Marie Maersk - MNBU3252653',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-10-03T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'ISA',
    subcontractName: 'QMS',
    registrationDate: new Date('2025-10-06'),
    clientRef: '', // Will be normalized to 'N/A'
    claimName: 'Marie Maersk - MNBU3599581',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-10-06T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'Yarra Marine',
    subcontractName: 'QMS',
    registrationDate: new Date('2025-10-08'),
    clientRef: '', // Will be normalized to 'N/A'
    claimName: 'Challenge Meats',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-10-08T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'ISS Shipping',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-10-08'),
    clientRef: '', // Will be normalized to 'N/A'
    claimName: 'Bulging Containers',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-10-08T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'wkw',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-10-15'),
    clientRef: '565/6039755/C',
    claimName: 'R.S. RICE MILLS',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-10-15T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'QMS',
    registrationDate: new Date('2025-10-16'),
    clientRef: '403/60/39941/C',
    claimName: 'CAPPELLOTTO S.P.A',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-10-16T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Alcel',
    registrationDate: new Date('2025-10-17'),
    clientRef: '495/60/40124/C',
    claimName: 'JOYALUKKAS JEWELLERY PTY LTD',
    location: 'Sydney',
    siteInspectionDateTime: new Date('2025-10-17T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-10-21'),
    clientRef: '565/6040527/C',
    claimName: 'FAZLANI EXPORTS PVT. LTD.',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-10-21T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-10-22'),
    clientRef: '555/60/40746',
    claimName: 'Nestle - Inland loss 2',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-10-22T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-10-22'),
    clientRef: '565/6040796/C',
    claimName: 'RS RICE MILLS - MELBOURNE - 2ND CLAIM',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-10-22T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  },
  {
    clientName: 'WKW',
    subcontractName: 'Wave',
    registrationDate: new Date('2025-10-22'),
    clientRef: '565/60/40805/C',
    claimName: 'RS RICE MILLS - MELBOURNE - 3RD CLAIM',
    location: 'Melbourne',
    siteInspectionDateTime: new Date('2025-10-22T00:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 1000,
    subcontractAmount: 200,
    netProfit: 800
  }]

// ========================================
// SCRIPT LOGIC - DO NOT MODIFY UNLESS NECESSARY
// ========================================

/**
 * Normalize claim data
 * - If clientRef is empty, set it to 'N/A' (required field)
 */
const normalizeClaimData = (claimData) => {
  return {
    ...claimData,
    clientRef: claimData.clientRef && claimData.clientRef.trim() !== '' 
      ? claimData.clientRef 
      : 'N/A'
  }
}

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
    let normalizedCount = 0

    // Insert each claim
    for (let i = 0; i < claimsData.length; i++) {
      const claimData = claimsData[i]

      // Normalize claim data (handle required fields)
      const normalizedData = normalizeClaimData(claimData)
      
      // Count how many were normalized
      if (claimData.clientRef === '' || claimData.clientRef.trim() === '') {
        normalizedCount++
      }

      // Generate job number
      const jobNumber = `ALCEL-${TARGET_YEAR}-${String(currentNumber).padStart(3, '0')}`

      // Create claim
      const claim = await Claim.create({
        ...normalizedData,
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
    console.log(`   - Client Refs normalized ('' → 'N/A'): ${normalizedCount}`)
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
