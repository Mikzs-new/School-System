/**
 * Date utility functions for timezone-safe date handling
 * 
 * Backend returns UTC datetimes (ISO format with 'Z' suffix)
 * Frontend datetime-local inputs expect local time in format: YYYY-MM-DDTHH:mm
 * These utilities handle the conversion correctly.
 */

/**
 * Convert UTC datetime string to local datetime-local input format
 * @param {string} utcDateString - UTC datetime string (e.g., "2026-05-31T01:04:00Z")
 * @returns {string} Local datetime string in format "YYYY-MM-DDTHH:mm"
 */
export const utcToLocalDateTime = (utcDateString) => {
  if (!utcDateString) return ''
  
  const date = new Date(utcDateString)
  
  // Get local date components
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Convert local datetime string to UTC ISO format for API
 * @param {string} localDateTimeString - Local datetime string (e.g., "2026-05-31T01:04")
 * @returns {string} UTC datetime string in ISO format
 */
export const localDateTimeToUtc = (localDateTimeString) => {
  if (!localDateTimeString) return ''
  
  // Parse the local datetime string
  const date = new Date(localDateTimeString)
  
  // Return ISO string with 'Z' suffix (UTC)
  return date.toISOString()
}

/**
 * Format UTC datetime for display in local timezone
 * @param {string} utcDateString - UTC datetime string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string in local timezone
 */
export const formatUtcDate = (utcDateString, options = {}) => {
  if (!utcDateString) return 'N/A'
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  }
  
  return new Date(utcDateString).toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format UTC datetime for display with time in local timezone
 * @param {string} utcDateString - UTC datetime string
 * @returns {string} Formatted datetime string in local timezone
 */
export const formatUtcDateTime = (utcDateString) => {
  if (!utcDateString) return 'N/A'
  
  return new Date(utcDateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format UTC datetime for display as date only (no time)
 * @param {string} utcDateString - UTC datetime string
 * @returns {string} Formatted date string in local timezone
 */
export const formatUtcDateOnly = (utcDateString) => {
  return formatUtcDate(utcDateString, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
