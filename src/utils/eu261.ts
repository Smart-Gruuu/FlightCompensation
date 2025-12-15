/**
 * EU261 Utility Functions
 * Implements EU Regulation 261/2004 compensation calculation logic
 */

export interface EligibilityInput {
  departureAirport: string
  arrivalAirport: string
  scheduledDeparture: Date
  actualDeparture?: Date
  scheduledArrival: Date
  actualArrival?: Date
  flightDistance?: number
  isCancelled?: boolean
  cancellationReason?: string
  isExtraordinary?: boolean
  extraordinaryReason?: string
}

export interface EligibilityResult {
  isEligible: boolean
  compensationAmount: number | null
  reason: string
  delayMinutes?: number
  isExtraordinary: boolean
  extraordinaryReason?: string
}

/**
 * Calculate delay in minutes
 */
export function calculateDelay(
  scheduledArrival: Date,
  actualArrival?: Date
): number | null {
  if (!actualArrival) return null
  
  const delayMs = actualArrival.getTime() - scheduledArrival.getTime()
  return Math.floor(delayMs / (1000 * 60))
}

/**
 * Check if flight is eligible for compensation under EU261
 */
export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const result: EligibilityResult = {
    isEligible: false,
    compensationAmount: null,
    reason: '',
    isExtraordinary: input.isExtraordinary || false,
    extraordinaryReason: input.extraordinaryReason
  }

  // Extraordinary circumstances - no compensation
  if (input.isExtraordinary) {
    result.reason = 'Flight affected by extraordinary circumstances'
    result.extraordinaryReason = input.extraordinaryReason || 'Extraordinary circumstances'
    return result
  }

  // Calculate delay
  const delayMinutes = calculateDelay(input.scheduledArrival, input.actualArrival)
  result.delayMinutes = delayMinutes || 0

  // Get flight distance
  const distance = input.flightDistance || 0

  // Cancellation case
  if (input.isCancelled) {
    if (distance === 0) {
      result.reason = 'Flight distance not available - cannot determine eligibility'
      return result
    }

    if (distance <= 1500) {
      result.isEligible = true
      result.compensationAmount = 250
      result.reason = 'Flight cancelled - eligible for €250 (≤1,500 km)'
    } else if (distance <= 3500) {
      result.isEligible = true
      result.compensationAmount = 400
      result.reason = 'Flight cancelled - eligible for €400 (>1,500 km, ≤3,500 km)'
    } else {
      result.isEligible = true
      result.compensationAmount = 600
      result.reason = 'Flight cancelled - eligible for €600 (>3,500 km)'
    }
    return result
  }

  // Delay case
  if (!delayMinutes || delayMinutes < 0) {
    result.reason = 'No delay or delay not yet calculated'
    return result
  }

  if (distance === 0) {
    result.reason = 'Flight distance not available - cannot determine eligibility'
    return result
  }

  // EU261 delay thresholds
  if (distance <= 1500) {
    if (delayMinutes >= 180) { // 3 hours
      result.isEligible = true
      result.compensationAmount = 250
      result.reason = `Flight delayed ${delayMinutes} minutes - eligible for €250 (≤1,500 km, ≥3h delay)`
    } else {
      result.reason = `Flight delayed ${delayMinutes} minutes - not eligible (requires ≥3h delay for ≤1,500 km)`
    }
  } else if (distance <= 3500) {
    if (delayMinutes >= 180) { // 3 hours
      result.isEligible = true
      result.compensationAmount = 400
      result.reason = `Flight delayed ${delayMinutes} minutes - eligible for €400 (>1,500 km, ≤3,500 km, ≥3h delay)`
    } else {
      result.reason = `Flight delayed ${delayMinutes} minutes - not eligible (requires ≥3h delay for >1,500 km)`
    }
  } else {
    if (delayMinutes >= 240) { // 4 hours
      result.isEligible = true
      result.compensationAmount = 600
      result.reason = `Flight delayed ${delayMinutes} minutes - eligible for €600 (>3,500 km, ≥4h delay)`
    } else {
      result.reason = `Flight delayed ${delayMinutes} minutes - not eligible (requires ≥4h delay for >3,500 km)`
    }
  }

  return result
}

/**
 * Format compensation amount for display
 */
export function formatCompensationAmount(amount: number | null): string {
  if (amount === null) return 'N/A'
  return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    NEW: 'bg-gray-100 text-gray-800',
    IN_REVIEW: 'bg-blue-100 text-blue-800',
    ELIGIBILITY_CHECKED: 'bg-green-100 text-green-800',
    SUBMITTED_TO_AIRLINE: 'bg-purple-100 text-purple-800',
    AIRLINE_RESPONSE_RECEIVED: 'bg-yellow-100 text-yellow-800',
    AIRLINE_REJECTED: 'bg-red-100 text-red-800',
    ESCALATION_SENT: 'bg-orange-100 text-orange-800',
    NEGOTIATION: 'bg-indigo-100 text-indigo-800',
    SETTLEMENT_OFFERED: 'bg-teal-100 text-teal-800',
    PAID: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

