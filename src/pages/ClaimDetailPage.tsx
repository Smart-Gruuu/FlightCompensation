import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FileText, Mail, Calendar, Plane, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Claim } from '../types'
import { formatCompensationAmount } from '../utils/eu261'
import { format } from 'date-fns'
import { Button, Card, StatusBadge, Alert } from '../components'

export default function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [claim, setClaim] = useState<Claim | null>(null)

  useEffect(() => {
    // Load claim from localStorage (in real app, this would be from API)
    const storedClaims = localStorage.getItem('claims')
    if (storedClaims && id) {
      const claims: Claim[] = JSON.parse(storedClaims)
      const foundClaim = claims.find(c => c.id === id)
      setClaim(foundClaim || null)
    }
  }, [id])

  if (!claim) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Claim not found</h2>
        <p className="text-gray-600 mb-4">The claim you're looking for doesn't exist.</p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{claim.claimNumber}</h1>
          <StatusBadge status={claim.status} />
        </div>
        {claim.eligibleAmount && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Potential Compensation</p>
            <p className="text-3xl font-bold text-primary-600">
              {formatCompensationAmount(claim.eligibleAmount)}
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Flight Details */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold">Flight Details</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Flight Number</p>
                <p className="font-medium">{claim.flightDetails.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Airline</p>
                <p className="font-medium">{claim.flightDetails.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Route</p>
                <p className="font-medium">
                  {claim.flightDetails.departureAirport} → {claim.flightDetails.arrivalAirport}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Flight Date</p>
                <p className="font-medium">
                  {format(new Date(claim.flightDetails.flightDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled Departure</p>
                <p className="font-medium">
                  {format(new Date(claim.flightDetails.scheduledDeparture), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              {claim.flightDetails.actualDeparture && (
                <div>
                  <p className="text-sm text-gray-500">Actual Departure</p>
                  <p className="font-medium">
                    {format(new Date(claim.flightDetails.actualDeparture), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Scheduled Arrival</p>
                <p className="font-medium">
                  {format(new Date(claim.flightDetails.scheduledArrival), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              {claim.flightDetails.actualArrival && (
                <div>
                  <p className="text-sm text-gray-500">Actual Arrival</p>
                  <p className="font-medium">
                    {format(new Date(claim.flightDetails.actualArrival), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {claim.delayMinutes && (
                <div>
                  <p className="text-sm text-gray-500">Delay</p>
                  <p className="font-medium">
                    {claim.delayMinutes} minutes ({Math.floor(claim.delayMinutes / 60)}h {claim.delayMinutes % 60}m)
                  </p>
                </div>
              )}
              {claim.flightDistance && (
                <div>
                  <p className="text-sm text-gray-500">Flight Distance</p>
                  <p className="font-medium">{claim.flightDistance.toLocaleString()} km</p>
                </div>
              )}
              {claim.flightDetails.isCancelled && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Cancellation</p>
                  <p className="font-medium text-red-600">Flight was cancelled</p>
                  {claim.flightDetails.cancellationReason && (
                    <p className="text-sm text-gray-600 mt-1">
                      Reason: {claim.flightDetails.cancellationReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Passenger Details */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold">Passenger Details</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {claim.passengerDetails.firstName} {claim.passengerDetails.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{claim.passengerDetails.email}</p>
              </div>
              {claim.passengerDetails.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{claim.passengerDetails.phone}</p>
                </div>
              )}
              {claim.passengerDetails.address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {claim.passengerDetails.address}
                    {claim.passengerDetails.city && `, ${claim.passengerDetails.city}`}
                    {claim.passengerDetails.postalCode && ` ${claim.passengerDetails.postalCode}`}
                    {claim.passengerDetails.country && `, ${claim.passengerDetails.country}`}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Documents */}
          {claim.documents && claim.documents.length > 0 && (
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold">Documents</h2>
              </div>
              <div className="space-y-2">
                {claim.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{doc.originalName}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.fileSize / 1024).toFixed(2)} KB • {doc.fileType}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Communications */}
          {claim.communications && claim.communications.length > 0 && (
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold">Communications</h2>
              </div>
              <div className="space-y-4">
                {claim.communications.map((comm) => (
                  <div key={comm.id} className="border-l-4 border-primary-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{comm.subject}</p>
                        <p className="text-sm text-gray-500">{comm.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        comm.direction === 'OUTBOUND' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {comm.direction}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{comm.content}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(comm.sentAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold">Timeline</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Created</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(claim.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              {claim.submittedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Submitted</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(claim.submittedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {claim.paidAt && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Paid</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(claim.paidAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* GDPR & POA */}
          <Card className="bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Consents</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                {claim.gdprConsent ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={claim.gdprConsent ? 'text-green-700' : 'text-red-700'}>
                  GDPR Consent
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {claim.poaSigned ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={claim.poaSigned ? 'text-green-700' : 'text-red-700'}>
                  Power of Attorney
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

