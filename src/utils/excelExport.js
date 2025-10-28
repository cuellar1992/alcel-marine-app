/**
 * Excel Export Utility with Premium Styling
 * Uses ExcelJS for advanced styling and formatting
 */

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * Export jobs to Excel with premium styling
 * @param {Array} jobs - Array of job objects
 * @param {String} filename - Output filename (without extension)
 */
export const exportJobsToExcel = async (jobs, filename = 'Alcel_Marine_Jobs') => {
  try {
    // Note: Jobs are expected to be pre-sorted by the caller
    // No sorting is done here to preserve the order passed in
    const sortedJobs = jobs
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    
    // Set workbook properties
    workbook.creator = 'Alcel Marine'
    workbook.created = new Date()
    workbook.modified = new Date()
    workbook.lastPrinted = new Date()
    
    // Add a worksheet
    const worksheet = workbook.addWorksheet('Jobs Report', {
      properties: {
        tabColor: { argb: '1E3A8A' } // Navy blue tab
      },
      views: [
        { 
          state: 'frozen', 
          xSplit: 0, 
          ySplit: 1, // Freeze header row
          showGridLines: false // Hide gridlines for elegant design
        }
      ]
    })

    // Check if any job has financial data (issued or paid)
    const hasFinancialData = sortedJobs.some(job => 
      job.invoiceIssue === 'issued' || job.invoiceIssue === 'paid'
    )

    // Define columns with headers and widths
    const columns = [
      { header: 'Job Number', key: 'jobNumber', width: 18 },
      { header: 'Vessel Name', key: 'vesselName', width: 25 },
      { header: 'Date & Time', key: 'dateTime', width: 22 },
      { header: 'ETB', key: 'etb', width: 22 },
      { header: 'ETD', key: 'etd', width: 22 },
      { header: 'Port', key: 'port', width: 18 },
      { header: 'Job Type', key: 'jobType', width: 20 },
      { header: 'Client', key: 'clientName', width: 25 },
      { header: 'Subcontract Name', key: 'subcontractName', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Invoice Status', key: 'invoiceIssue', width: 15 }
    ]

    // Add financial columns if any job has financial data
    if (hasFinancialData) {
      columns.push(
        { header: 'Invoice Amount (AUD)', key: 'invoiceAmount', width: 20 },
        { header: 'Subcontract Amount (AUD)', key: 'subcontractAmount', width: 22 },
        { header: 'Net Profit (AUD)', key: 'netProfit', width: 18 }
      )
    }

    // Add remark column at the end
    columns.push({ header: 'Remark', key: 'remark', width: 35 })

    worksheet.columns = columns

    // Style the header row (Row 1)
    const headerRow = worksheet.getRow(1)
    headerRow.height = 30
    
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1E3A8A' } // Navy blue background
      }
      cell.font = {
        name: 'Calibri',
        size: 12,
        bold: true,
        color: { argb: 'FFFFFF' } // White text
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      }
      // No borders for elegant design
    })

    // Add data rows (sorted by job number)
    sortedJobs.forEach((job, index) => {
      const dateTime = new Date(job.dateTime)
      const etb = job.etb ? new Date(job.etb) : null
      const etd = job.etd ? new Date(job.etd) : null
      
      const rowData = {
        jobNumber: job.jobNumber,
        vesselName: job.vesselName,
        dateTime: `${dateTime.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })} ${dateTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}`,
        etb: etb ? `${etb.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })} ${etb.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}` : '',
        etd: etd ? `${etd.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })} ${etd.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}` : '',
        port: job.port,
        jobType: formatJobType(job.jobType),
        clientName: job.clientName,
        subcontractName: job.subcontractName || '',
        status: formatStatus(job.status),
        invoiceIssue: formatInvoiceStatus(job.invoiceIssue)
      }

      // Add financial data if invoice is issued or paid
      if (hasFinancialData) {
        if (job.invoiceIssue === 'issued' || job.invoiceIssue === 'paid') {
          rowData.invoiceAmount = job.invoiceAmount || 0
          rowData.subcontractAmount = job.subcontractAmount || 0
          rowData.netProfit = job.netProfit || 0
        } else {
          rowData.invoiceAmount = ''
          rowData.subcontractAmount = ''
          rowData.netProfit = ''
        }
      }

      // Add remark
      rowData.remark = job.remark || ''

      const row = worksheet.addRow(rowData)

      // Alternate row colors for better readability
      const isEven = index % 2 === 0
      const remarkColIndex = hasFinancialData ? 15 : 12 // Column index for remarks
      
      row.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isEven ? 'F8FAFC' : 'FFFFFF' } // Light gray / white
        }
        cell.font = {
          name: 'Calibri',
          size: 11,
          color: { argb: '1E293B' } // Dark slate
        }
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: colNumber === remarkColIndex // Wrap text for remarks column
        }
        // No borders for clean, elegant design
      })

      // Format financial cells as currency
      if (hasFinancialData && (job.invoiceIssue === 'issued' || job.invoiceIssue === 'paid')) {
        const invoiceCell = row.getCell('invoiceAmount')
        const subcontractCell = row.getCell('subcontractAmount')
        const netProfitCell = row.getCell('netProfit')

        // Apply currency format
        invoiceCell.numFmt = '$#,##0.00'
        subcontractCell.numFmt = '$#,##0.00'
        netProfitCell.numFmt = '$#,##0.00'

        // Style net profit cell
        netProfitCell.font = {
          name: 'Calibri',
          size: 11,
          bold: true,
          color: { argb: '059669' } // Green for profit
        }
      }

      // Special styling for status column
      const statusCell = row.getCell('status')
      const invoiceCell = row.getCell('invoiceIssue')

      // Color-code status
      switch (job.status) {
        case 'completed':
          statusCell.font = { ...statusCell.font, color: { argb: '059669' }, bold: true }
          break
        case 'in-progress':
          statusCell.font = { ...statusCell.font, color: { argb: '3B82F6' }, bold: true }
          break
        case 'pending':
          statusCell.font = { ...statusCell.font, color: { argb: 'F59E0B' }, bold: true }
          break
        case 'cancelled':
          statusCell.font = { ...statusCell.font, color: { argb: 'EF4444' }, bold: true }
          break
      }

      // Color-code invoice status
      switch (job.invoiceIssue) {
        case 'paid':
          invoiceCell.font = { ...invoiceCell.font, color: { argb: '059669' }, bold: true }
          break
        case 'issued':
          invoiceCell.font = { ...invoiceCell.font, color: { argb: '3B82F6' }, bold: true }
          break
        case 'not-issued':
          invoiceCell.font = { ...invoiceCell.font, color: { argb: 'EF4444' }, bold: true }
          break
      }
    })

    // Add summary row at the bottom
    const summaryData = {
      jobNumber: '',
      vesselName: `Total Jobs: ${sortedJobs.length}`,
      dateTime: '',
      etb: '',
      etd: '',
      port: '',
      jobType: '',
      clientName: '',
      subcontractName: '',
      status: '',
      invoiceIssue: ''
    }

    // Calculate financial totals if applicable
    if (hasFinancialData) {
      const totalInvoice = sortedJobs
        .filter(j => j.invoiceIssue === 'issued' || j.invoiceIssue === 'paid')
        .reduce((sum, job) => sum + (job.invoiceAmount || 0), 0)
      
      const totalSubcontract = sortedJobs
        .filter(j => j.invoiceIssue === 'issued' || j.invoiceIssue === 'paid')
        .reduce((sum, job) => sum + (job.subcontractAmount || 0), 0)
      
      const totalProfit = sortedJobs
        .filter(j => j.invoiceIssue === 'issued' || j.invoiceIssue === 'paid')
        .reduce((sum, job) => sum + (job.netProfit || 0), 0)

      summaryData.invoiceAmount = totalInvoice
      summaryData.subcontractAmount = totalSubcontract
      summaryData.netProfit = totalProfit
    }

    summaryData.remark = `Generated on ${new Date().toLocaleString('en-US')}`

    const summaryRow = worksheet.addRow(summaryData)

    summaryRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F1F5F9' }
      }
      cell.font = {
        name: 'Calibri',
        size: 10,
        italic: true,
        color: { argb: '64748B' }
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      }
    })

    // Format financial totals in summary row
    if (hasFinancialData) {
      const summaryInvoiceCell = summaryRow.getCell('invoiceAmount')
      const summarySubcontractCell = summaryRow.getCell('subcontractAmount')
      const summaryNetProfitCell = summaryRow.getCell('netProfit')

      summaryInvoiceCell.numFmt = '$#,##0.00'
      summarySubcontractCell.numFmt = '$#,##0.00'
      summaryNetProfitCell.numFmt = '$#,##0.00'

      summaryInvoiceCell.font = { ...summaryInvoiceCell.font, bold: true, italic: false, color: { argb: '1E293B' } }
      summarySubcontractCell.font = { ...summarySubcontractCell.font, bold: true, italic: false, color: { argb: '1E293B' } }
      summaryNetProfitCell.font = { ...summaryNetProfitCell.font, bold: true, italic: false, color: { argb: '059669' } }
    }

    // Auto-fit row heights
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && rowNumber < worksheet.rowCount) {
        row.height = 25
      }
    })

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    // Download file
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    return true
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw error
  }
}

// Helper function to format job type
const formatJobType = (type) => {
  if (!type) return ''
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper function to format status
const formatStatus = (status) => {
  if (!status) return ''
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper function to format invoice status
const formatInvoiceStatus = (status) => {
  if (!status) return ''
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Export claims to Excel with premium styling
 * @param {Array} claims - Array of claim objects
 * @param {String} filename - Output filename (without extension)
 */
export const exportClaimsToExcel = async (claims, filename = 'Alcel_Marine_Claims') => {
  try {
    // Note: Claims are expected to be pre-sorted by the caller
    // No sorting is done here to preserve the order passed in
    const sortedClaims = claims
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    
    // Set workbook properties
    workbook.creator = 'Alcel Marine'
    workbook.created = new Date()
    workbook.modified = new Date()
    workbook.lastPrinted = new Date()
    
    // Add a worksheet
    const worksheet = workbook.addWorksheet('Claims Report', {
      properties: {
        tabColor: { argb: '1E3A8A' } // Navy blue tab
      },
      views: [
        { 
          state: 'frozen', 
          xSplit: 0, 
          ySplit: 1, // Freeze header row
          showGridLines: false // Hide gridlines for elegant design
        }
      ]
    })

    // Check if any claim has financial data (issued or paid)
    const hasFinancialData = sortedClaims.some(claim => 
      claim.invoiceIssue === 'issued' || claim.invoiceIssue === 'paid'
    )

    // Define columns with headers and widths
    const columns = [
      { header: 'Job Number', key: 'jobNumber', width: 18 },
      { header: 'Client Name', key: 'clientName', width: 25 },
      { header: 'Claim Name', key: 'claimName', width: 30 },
      { header: 'Registration Date', key: 'registrationDate', width: 20 },
      { header: 'Client Ref', key: 'clientRef', width: 20 },
      { header: 'Location', key: 'location', width: 25 },
      { header: 'Subcontract Name', key: 'subcontractName', width: 25 },
      { header: 'Site Inspection', key: 'siteInspection', width: 22 },
      { header: 'Invoice Status', key: 'invoiceIssue', width: 15 }
    ]

    // Add financial columns if any claim has financial data
    if (hasFinancialData) {
      columns.push(
        { header: 'Invoice Amount', key: 'invoiceAmount', width: 18 },
        { header: 'Subcontract Amount', key: 'subcontractAmount', width: 20 },
        { header: 'Net Profit', key: 'netProfit', width: 15 }
      )
    }

    // Add remark column at the end
    columns.push({ header: 'Remark', key: 'remark', width: 35 })

    worksheet.columns = columns

    // Style the header row (Row 1)
    const headerRow = worksheet.getRow(1)
    headerRow.height = 30
    
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1E3A8A' } // Navy blue background
      }
      cell.font = {
        name: 'Calibri',
        size: 12,
        bold: true,
        color: { argb: 'FFFFFF' } // White text
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      }
    })

    // Add data rows (sorted by job number)
    sortedClaims.forEach((claim, index) => {
      const registrationDate = new Date(claim.registrationDate)
      const siteInspection = claim.siteInspectionDateTime ? new Date(claim.siteInspectionDateTime) : null
      
      const rowData = {
        jobNumber: claim.jobNumber,
        claimName: claim.claimName,
        clientName: claim.clientName,
        registrationDate: registrationDate.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }),
        clientRef: claim.clientRef,
        location: claim.location,
        subcontractName: claim.subcontractName || '',
        siteInspection: siteInspection ? `${siteInspection.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })} ${siteInspection.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}` : '',
        invoiceIssue: formatInvoiceStatus(claim.invoiceIssue)
      }

      // Add financial data if invoice is issued or paid
      if (hasFinancialData) {
        if (claim.invoiceIssue === 'issued' || claim.invoiceIssue === 'paid') {
          rowData.invoiceAmount = claim.invoiceAmount || 0
          rowData.subcontractAmount = claim.subcontractAmount || 0
          rowData.netProfit = claim.netProfit || 0
        } else {
          rowData.invoiceAmount = ''
          rowData.subcontractAmount = ''
          rowData.netProfit = ''
        }
      }

      // Add remark
      rowData.remark = claim.remark || ''

      const row = worksheet.addRow(rowData)

      // Alternate row colors for better readability
      const isEven = index % 2 === 0
      const remarkColIndex = hasFinancialData ? 13 : 10 // Column index for remarks

      row.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isEven ? 'F8FAFC' : 'FFFFFF' } // Light gray / white
        }
        cell.font = {
          name: 'Calibri',
          size: 11,
          color: { argb: '1E293B' } // Dark slate
        }
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: colNumber === remarkColIndex // Wrap text for remarks column
        }
      })

      // Format financial cells as currency
      if (hasFinancialData && (claim.invoiceIssue === 'issued' || claim.invoiceIssue === 'paid')) {
        const invoiceCell = row.getCell('invoiceAmount')
        const subcontractCell = row.getCell('subcontractAmount')
        const netProfitCell = row.getCell('netProfit')

        // Apply currency format
        invoiceCell.numFmt = '$#,##0.00'
        subcontractCell.numFmt = '$#,##0.00'
        netProfitCell.numFmt = '$#,##0.00'

        // Style net profit cell
        netProfitCell.font = {
          name: 'Calibri',
          size: 11,
          bold: true,
          color: { argb: '059669' } // Green for profit
        }
      }

      // Color-code invoice status
      const invoiceCell = row.getCell('invoiceIssue')
      switch (claim.invoiceIssue) {
        case 'paid':
          invoiceCell.font = { ...invoiceCell.font, color: { argb: '059669' }, bold: true }
          break
        case 'issued':
          invoiceCell.font = { ...invoiceCell.font, color: { argb: '3B82F6' }, bold: true }
          break
        case 'not-issued':
          invoiceCell.font = { ...invoiceCell.font, color: { argb: 'EF4444' }, bold: true }
          break
      }
    })

    // Add summary row at the bottom
    const summaryData = {
      jobNumber: '',
      clientName: '',
      claimName: `Total Claims: ${sortedClaims.length}`,
      registrationDate: '',
      clientRef: '',
      location: '',
      subcontractName: '',
      siteInspection: '',
      invoiceIssue: ''
    }

    // Calculate financial totals if applicable
    if (hasFinancialData) {
      const totalInvoice = sortedClaims
        .filter(c => c.invoiceIssue === 'issued' || c.invoiceIssue === 'paid')
        .reduce((sum, claim) => sum + (claim.invoiceAmount || 0), 0)
      
      const totalSubcontract = sortedClaims
        .filter(c => c.invoiceIssue === 'issued' || c.invoiceIssue === 'paid')
        .reduce((sum, claim) => sum + (claim.subcontractAmount || 0), 0)
      
      const totalProfit = sortedClaims
        .filter(c => c.invoiceIssue === 'issued' || c.invoiceIssue === 'paid')
        .reduce((sum, claim) => sum + (claim.netProfit || 0), 0)

      summaryData.invoiceAmount = totalInvoice
      summaryData.subcontractAmount = totalSubcontract
      summaryData.netProfit = totalProfit
    }

    const summaryRow = worksheet.addRow(summaryData)

    summaryRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F1F5F9' }
      }
      cell.font = {
        name: 'Calibri',
        size: 10,
        italic: true,
        color: { argb: '64748B' }
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      }
    })

    // Format financial totals in summary row
    if (hasFinancialData) {
      const summaryInvoiceCell = summaryRow.getCell('invoiceAmount')
      const summarySubcontractCell = summaryRow.getCell('subcontractAmount')
      const summaryNetProfitCell = summaryRow.getCell('netProfit')

      summaryInvoiceCell.numFmt = '$#,##0.00'
      summarySubcontractCell.numFmt = '$#,##0.00'
      summaryNetProfitCell.numFmt = '$#,##0.00'

      summaryInvoiceCell.font = { ...summaryInvoiceCell.font, bold: true, italic: false, color: { argb: '1E293B' } }
      summarySubcontractCell.font = { ...summarySubcontractCell.font, bold: true, italic: false, color: { argb: '1E293B' } }
      summaryNetProfitCell.font = { ...summaryNetProfitCell.font, bold: true, italic: false, color: { argb: '059669' } }
    }

    // Auto-fit row heights
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && rowNumber < worksheet.rowCount) {
        row.height = 25
      }
    })

    // Add generation info to summary
    const lastRow = worksheet.addRow({
      jobNumber: '',
      clientName: '',
      claimName: '',
      registrationDate: '',
      clientRef: '',
      location: '',
      subcontractName: '',
      siteInspection: '',
      invoiceIssue: `Generated on ${new Date().toLocaleString('en-US')}`
    })

    lastRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F1F5F9' }
      }
      cell.font = {
        name: 'Calibri',
        size: 9,
        italic: true,
        color: { argb: '94A3B8' }
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      }
    })

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    // Download file
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    return true
  } catch (error) {
    console.error('Error exporting claims to Excel:', error)
    throw error
  }
}

