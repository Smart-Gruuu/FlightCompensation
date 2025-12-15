import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import { checkEligibility, formatCompensationAmount, type EligibilityInput } from '../utils/eu261'
import { Button, Card, Input, Textarea, Checkbox, Alert } from '../components'

interface EligibilityFormData {
  departureAirport: string
  arrivalAirport: string
  scheduledDeparture: string
  actualDeparture?: string
  scheduledArrival: string
  actualArrival?: string
  flightDistance?: number
  isCancelled: boolean
  cancellationReason?: string
  isExtraordinary: boolean
  extraordinaryReason?: string
}

export default function EligibilityCheckPage() {
  const [result, setResult] = useState<ReturnType<typeof checkEligibility> | null>(null)
  const { register, handleSubmit, formState: { errors }, watch } = useForm<EligibilityFormData>({
    defaultValues: {
      isCancelled: false,
      isExtraordinary: false
    }
  })

  const isCancelled = watch('isCancelled')
  const isExtraordinary = watch('isExtraordinary')

  const onSubmit = (data: EligibilityFormData) => {
    const input: EligibilityInput = {
      departureAirport: data.departureAirport.toUpperCase(),
      arrivalAirport: data.arrivalAirport.toUpperCase(),
      scheduledDeparture: new Date(data.scheduledDeparture),
      actualDeparture: data.actualDeparture ? new Date(data.actualDeparture) : undefined,
      scheduledArrival: new Date(data.scheduledArrival),
      actualArrival: data.actualArrival ? new Date(data.actualArrival) : undefined,
      flightDistance: data.flightDistance,
      isCancelled: data.isCancelled,
      cancellationReason: data.cancellationReason,
      isExtraordinary: data.isExtraordinary,
      extraordinaryReason: data.extraordinaryReason
    }

    const eligibilityResult = checkEligibility(input)
    setResult(eligibilityResult)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Check Eligibility</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Flight Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Departure Airport (IATA)"
                placeholder="LHR"
                maxLength={3}
                {...register('departureAirport', {
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z]{3}$/i,
                    message: '3-letter code'
                  }
                })}
                error={errors.departureAirport?.message}
                required
              />

              <Input
                label="Arrival Airport (IATA)"
                placeholder="JFK"
                maxLength={3}
                {...register('arrivalAirport', {
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z]{3}$/i,
                    message: '3-letter code'
                  }
                })}
                error={errors.arrivalAirport?.message}
                required
              />
            </div>

            <Input
              label="Flight Distance (km)"
              type="number"
              placeholder="e.g., 2500"
              {...register('flightDistance', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be positive' }
              })}
              error={errors.flightDistance?.message}
              helperText="Leave empty if unknown - we'll try to calculate it"
            />

            <Input
              label="Scheduled Departure"
              type="datetime-local"
              {...register('scheduledDeparture', { required: 'Required' })}
              error={errors.scheduledDeparture?.message}
              required
            />

            <Input
              label="Actual Departure"
              type="datetime-local"
              {...register('actualDeparture')}
            />

            <Input
              label="Scheduled Arrival"
              type="datetime-local"
              {...register('scheduledArrival', { required: 'Required' })}
              error={errors.scheduledArrival?.message}
              required
            />

            <div>
              <label className="label">Actual Arrival</label>
              <input
                type="datetime-local"
                className="input"
                {...register('actualArrival')}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCancelled"
                {...register('isCancelled')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isCancelled" className="text-sm text-gray-700">
                Flight was cancelled
              </label>
            </div>

            {isCancelled && (
              <Textarea
                label="Cancellation Reason"
                rows={2}
                {...register('cancellationReason')}
              />
            )}

            <Checkbox
              id="isExtraordinary"
              label="Extraordinary circumstances (weather, security, etc.)"
              {...register('isExtraordinary')}
            />

            {isExtraordinary && (
              <Textarea
                label="Extraordinary Circumstances Reason"
                rows={2}
                {...register('extraordinaryReason')}
              />
            )}

            <Button type="submit" className="w-full">
              Check Eligibility
            </Button>
          </form>
        </Card>

        {/* Results */}
        <div>
          {result ? (
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                {result.isEligible ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
                <h2 className="text-xl font-semibold">
                  {result.isEligible ? 'Eligible for Compensation' : 'Not Eligible'}
                </h2>
              </div>

              {result.isEligible && (
                <Alert variant="success" className="mb-4">
                  <div className="text-3xl font-bold mb-2">
                    {formatCompensationAmount(result.compensationAmount)}
                  </div>
                  <p className="text-sm">
                    Potential compensation amount under EU261
                  </p>
                </Alert>
              )}

              {result.isExtraordinary && (
                <Alert variant="warning" className="mb-4" title="Extraordinary Circumstances">
                  <p className="text-sm mt-1">
                    {result.extraordinaryReason || 'Flight affected by extraordinary circumstances'}
                  </p>
                  <p className="text-xs mt-2">
                    No compensation is payable if the delay/cancellation was caused by extraordinary 
                    circumstances beyond the airline's control.
                  </p>
                </Alert>
              )}

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status:</p>
                  <p className="text-sm text-gray-900">{result.reason}</p>
                </div>

                {result.delayMinutes !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Delay:</p>
                    <p className="text-sm text-gray-900">
                      {result.delayMinutes} minutes ({Math.floor(result.delayMinutes / 60)}h {result.delayMinutes % 60}m)
                    </p>
                  </div>
                )}

                {result.isEligible && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link to="/claim/new">
                      <Button className="w-full">File a Claim</Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Alert variant="info" title="EU261 Eligibility Rules">
              <ul className="text-sm space-y-1 mt-2">
                <li>• <strong>€250:</strong> Flights ≤ 1,500 km (≥3h delay or cancelled)</li>
                <li>• <strong>€400:</strong> Flights &gt; 1,500 km within EU (≥3h delay or cancelled)</li>
                <li>• <strong>€600:</strong> Flights &gt; 3,500 km (≥4h delay or cancelled)</li>
              </ul>
              <p className="text-xs mt-3">
                Fill out the form to check if your flight is eligible for compensation.
              </p>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

