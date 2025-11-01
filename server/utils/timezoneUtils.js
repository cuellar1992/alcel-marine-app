/**
 * Timezone Utilities
 * Helper functions for handling Australia/Sydney timezone in date queries
 */

/**
 * Get the current month date range in Sydney timezone, converted to UTC for MongoDB queries
 * @returns {Object} { startOfMonth, endOfMonth } - Both as UTC Date objects
 */
export const getSydneyMonthRange = () => {
  const nowUTC = new Date()
  const sydneyTimeString = nowUTC.toLocaleString('en-US', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  // Parse the Sydney time to get year and month
  const [datePart] = sydneyTimeString.split(', ')
  const [month, day, year] = datePart.split('/')
  const sydneyYear = parseInt(year)
  const sydneyMonth = parseInt(month) - 1 // JavaScript months are 0-indexed

  // Create start of month in Sydney timezone, then convert to UTC for MongoDB query
  // Sydney is UTC+11 (or UTC+10 during DST), so we subtract 11 hours to get UTC equivalent
  const startOfMonthSydney = new Date(Date.UTC(sydneyYear, sydneyMonth, 1, 0, 0, 0, 0))
  const startOfMonth = new Date(startOfMonthSydney.getTime() - (11 * 60 * 60 * 1000))

  // End of month in Sydney timezone
  const endOfMonthSydney = new Date(Date.UTC(sydneyYear, sydneyMonth + 1, 0, 23, 59, 59, 999))
  const endOfMonth = new Date(endOfMonthSydney.getTime() - (11 * 60 * 60 * 1000))

  return { startOfMonth, endOfMonth }
}

/**
 * Get the current year date range in Sydney timezone, converted to UTC for MongoDB queries
 * @returns {Object} { startOfYear, endOfYear } - Both as UTC Date objects
 */
export const getSydneyYearRange = () => {
  const nowUTC = new Date()
  const sydneyTimeString = nowUTC.toLocaleString('en-US', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  // Parse the Sydney time to get year
  const [datePart] = sydneyTimeString.split(', ')
  const [month, day, year] = datePart.split('/')
  const sydneyYear = parseInt(year)

  // Create start of year in Sydney timezone (January 1st, 00:00:00)
  const startOfYearSydney = new Date(Date.UTC(sydneyYear, 0, 1, 0, 0, 0, 0))
  const startOfYear = new Date(startOfYearSydney.getTime() - (11 * 60 * 60 * 1000))

  // End of year in Sydney timezone (December 31st, 23:59:59.999)
  const endOfYearSydney = new Date(Date.UTC(sydneyYear, 11, 31, 23, 59, 59, 999))
  const endOfYear = new Date(endOfYearSydney.getTime() - (11 * 60 * 60 * 1000))

  return { startOfYear, endOfYear }
}
