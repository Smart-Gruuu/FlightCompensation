export type ClaimStatus = 
  | 'NEW'
  | 'IN_REVIEW'
  | 'ELIGIBILITY_CHECKED'
  | 'SUBMITTED_TO_AIRLINE'
  | 'AIRLINE_RESPONSE_RECEIVED'
  | 'AIRLINE_REJECTED'
  | 'ESCALATION_SENT'
  | 'NEGOTIATION'
  | 'SETTLEMENT_OFFERED'
  | 'PAID'
  | 'CLOSED'
  | 'REJECTED'

export interface FlightDetails {
  flightNumber: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  scheduledDeparture: string
  actualDeparture?: string
  scheduledArrival: string
  actualArrival?: string
  flightDate: string
  isCancelled?: boolean
  cancellationReason?: string
  isExtraordinary?: boolean
  extraordinaryReason?: string
}

export interface PassengerDetails {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface Claim {
  id: string
  claimNumber: string
  status: ClaimStatus
  flightDetails: FlightDetails
  passengerDetails: PassengerDetails
  flightDistance?: number
  delayMinutes?: number
  eligibleAmount?: number
  calculatedAmount?: number
  finalAmount?: number
  poaSigned: boolean
  poaSignedDate?: string
  gdprConsent: boolean
  gdprConsentDate?: string
  createdAt: string
  updatedAt: string
  submittedAt?: string
  paidAt?: string
  documents?: Document[]
  communications?: Communication[]
}

export interface Document {
  id: string
  fileName: string
  originalName: string
  fileType: string
  fileSize: number
  uploadedAt: string
}

export interface Communication {
  id: string
  type: string
  direction: 'OUTBOUND' | 'INBOUND'
  subject: string
  content: string
  sentAt: string
  receivedAt?: string
  airlineEmail?: string
}

export interface EligibilityResult {
  isEligible: boolean
  compensationAmount: number | null
  reason: string
  delayMinutes?: number
  isExtraordinary: boolean
  extraordinaryReason?: string
}

