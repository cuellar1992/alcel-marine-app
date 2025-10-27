/**
 * Intelligent Job Number Sorting Utility
 * Sorts job numbers like ALCEL-24-001 by year and then by sequence number
 */

/**
 * Parse job number into components
 * @param {string} jobNumber - Job number in format ALCEL-YY-XXX
 * @returns {object} - Object with year and sequence
 */
export const parseJobNumber = (jobNumber) => {
  if (!jobNumber || typeof jobNumber !== 'string') {
    return { year: 0, sequence: 0, original: jobNumber }
  }

  // Expected format: ALCEL-YY-XXX or similar PREFIX-YY-XXX
  const parts = jobNumber.split('-')

  if (parts.length < 3) {
    return { year: 0, sequence: 0, original: jobNumber }
  }

  const year = parseInt(parts[1], 10) || 0
  const sequence = parseInt(parts[2], 10) || 0

  return { year, sequence, original: jobNumber }
}

/**
 * Compare two job numbers intelligently
 * @param {string} a - First job number
 * @param {string} b - Second job number
 * @param {string} order - 'asc' or 'desc' (for year ordering)
 * @returns {number} - Comparison result
 * Note: Sequence is always ascending within the same year
 */
export const compareJobNumbers = (a, b, order = 'asc') => {
  const parsedA = parseJobNumber(a)
  const parsedB = parseJobNumber(b)

  // First, compare by year
  if (parsedA.year !== parsedB.year) {
    return order === 'asc'
      ? parsedA.year - parsedB.year
      : parsedB.year - parsedA.year
  }

  // If years are the same, ALWAYS compare by sequence ascending
  return parsedA.sequence - parsedB.sequence
}

/**
 * Sort array of objects by job number property
 * @param {Array} items - Array of objects with jobNumber property
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted array
 */
export const sortByJobNumber = (items, order = 'asc') => {
  return [...items].sort((a, b) =>
    compareJobNumbers(a.jobNumber, b.jobNumber, order)
  )
}

/**
 * Get default sort order (most recent year first, then by sequence ascending)
 * @param {Array} items - Array of objects with jobNumber property
 * @returns {Array} - Sorted array (newest year first, ascending sequence within year)
 */
export const sortByJobNumberDefault = (items) => {
  return [...items].sort((a, b) => {
    const parsedA = parseJobNumber(a.jobNumber)
    const parsedB = parseJobNumber(b.jobNumber)

    // Sort by year descending (newest first)
    if (parsedA.year !== parsedB.year) {
      return parsedB.year - parsedA.year
    }

    // Within same year, sort by sequence ascending
    return parsedA.sequence - parsedB.sequence
  })
}
