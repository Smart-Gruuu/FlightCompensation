import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Claim, ClaimStatus } from '../types'
import { formatCompensationAmount } from '../utils/eu261'
import { format } from 'date-fns'
import { Button, Card, StatusBadge, StatsCard } from '../components'

export default function DashboardPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [filter, setFilter] = useState<ClaimStatus | 'ALL'>('ALL')

  useEffect(() => {
    // Load claims from localStorage (in real app, this would be from API)
    const storedClaims = localStorage.getItem('claims')
    if (storedClaims) {
      setClaims(JSON.parse(storedClaims))
    }
  }, [])

  const filteredClaims = filter === 'ALL' 
    ? claims 
    : claims.filter(claim => claim.status === filter)

  const statusCounts = {
    NEW: claims.filter(c => c.status === 'NEW').length,
    IN_REVIEW: claims.filter(c => c.status === 'IN_REVIEW').length,
    SUBMITTED_TO_AIRLINE: claims.filter(c => c.status === 'SUBMITTED_TO_AIRLINE').length,
    PAID: claims.filter(c => c.status === 'PAID').length,
  }

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'REJECTED':
      case 'AIRLINE_REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'SUBMITTED_TO_AIRLINE':
      case 'ESCALATION_SENT':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Claims Dashboard</h1>
        <Link to="/claim/new">
          <Button>File New Claim</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard value={statusCounts.NEW} label="New Claims" variant="primary" />
        <StatsCard value={statusCounts.IN_REVIEW} label="In Review" variant="warning" />
        <StatsCard value={statusCounts.SUBMITTED_TO_AIRLINE} label="Submitted" variant="default" />
        <StatsCard value={statusCounts.PAID} label="Paid" variant="success" />
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === 'ALL' ? 'primary' : 'secondary'}
            onClick={() => setFilter('ALL')}
          >
            All ({claims.length})
          </Button>
          {Object.entries(statusCounts).map(([status, count]) => (
            <Button
              key={status}
              size="sm"
              variant={filter === status ? 'primary' : 'secondary'}
              onClick={() => setFilter(status as ClaimStatus)}
            >
              {status.replace(/_/g, ' ')} ({count})
            </Button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      {filteredClaims.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No claims found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'ALL' 
              ? "You haven't filed any claims yet."
              : `No claims with status "${filter.replace(/_/g, ' ')}".`
            }
          </p>
          <Link to="/claim/new">
            <Button>File Your First Claim</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <Link
              key={claim.id}
              to={`/claims/${claim.id}`}
            >
              <Card hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(claim.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {claim.claimNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {claim.flightDetails.flightNumber} - {claim.flightDetails.airline}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">Route</p>
                        <p className="text-sm font-medium text-gray-900">
                          {claim.flightDetails.departureAirport} → {claim.flightDetails.arrivalAirport}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Flight Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(claim.flightDetails.flightDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Compensation</p>
                        <p className="text-sm font-medium text-gray-900">
                          {claim.eligibleAmount 
                            ? formatCompensationAmount(claim.eligibleAmount)
                            : 'TBD'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <StatusBadge status={claim.status} />
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(claim.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

