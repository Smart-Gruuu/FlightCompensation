import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FlightDetails, PassengerDetails } from '../types'
import { Button, Card, Input, Textarea, FileUpload, Checkbox, StepIndicator, Alert } from '../components'

interface ClaimFormData {
  flight: FlightDetails
  passenger: PassengerDetails
  gdprConsent: boolean
  poaConsent: boolean
}

export default function ClaimIntakePage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ClaimFormData>({
    defaultValues: {
      flight: {
        isCancelled: false,
        isExtraordinary: false
      },
      passenger: {},
      gdprConsent: false,
      poaConsent: false
    }
  })

  const gdprConsent = watch('gdprConsent')
  const poaConsent = watch('poaConsent')


  const onSubmit = async (data: ClaimFormData) => {
    // In a real app, this would send to backend API
    console.log('Claim data:', data)
    console.log('Uploaded files:', uploadedFiles)
    
    // Simulate claim creation
    const claimId = `claim-${Date.now()}`
    
    // Store in localStorage for demo purposes
    const claims = JSON.parse(localStorage.getItem('claims') || '[]')
    claims.push({
      id: claimId,
      claimNumber: `EU261-${Date.now()}`,
      status: 'NEW',
      ...data,
      documents: uploadedFiles.map((f, i) => ({
        id: `doc-${i}`,
        fileName: f.name,
        originalName: f.name,
        fileType: f.type,
        fileSize: f.size
      })),
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('claims', JSON.stringify(claims))
    
    navigate(`/claims/${claimId}`)
  }

  const steps = [
    { number: 1, title: 'Flight Details' },
    { number: 2, title: 'Passenger Details' },
    { number: 3, title: 'Documents' },
    { number: 4, title: 'Review & Submit' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">File a New Claim</h1>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
        {/* Step 1: Flight Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Flight Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Flight Number"
                placeholder="e.g., BA123"
                {...register('flight.flightNumber', { required: 'Flight number is required' })}
                error={errors.flight?.flightNumber?.message}
                required
              />

              <Input
                label="Airline"
                placeholder="e.g., British Airways"
                {...register('flight.airline', { required: 'Airline is required' })}
                error={errors.flight?.airline?.message}
                required
              />

              <Input
                label="Departure Airport (IATA Code)"
                placeholder="e.g., LHR"
                maxLength={3}
                {...register('flight.departureAirport', {
                  required: 'Departure airport is required',
                  pattern: {
                    value: /^[A-Z]{3}$/,
                    message: 'Must be a valid 3-letter IATA code'
                  }
                })}
                error={errors.flight?.departureAirport?.message}
                required
              />

              <Input
                label="Arrival Airport (IATA Code)"
                placeholder="e.g., JFK"
                maxLength={3}
                {...register('flight.arrivalAirport', {
                  required: 'Arrival airport is required',
                  pattern: {
                    value: /^[A-Z]{3}$/,
                    message: 'Must be a valid 3-letter IATA code'
                  }
                })}
                error={errors.flight?.arrivalAirport?.message}
                required
              />

              <Input
                label="Flight Date"
                type="date"
                {...register('flight.flightDate', { required: 'Flight date is required' })}
                error={errors.flight?.flightDate?.message}
                required
              />

              <Input
                label="Scheduled Departure Time"
                type="datetime-local"
                {...register('flight.scheduledDeparture', { required: 'Scheduled departure is required' })}
                error={errors.flight?.scheduledDeparture?.message}
                required
              />

              <Input
                label="Actual Departure Time"
                type="datetime-local"
                {...register('flight.actualDeparture')}
              />

              <Input
                label="Scheduled Arrival Time"
                type="datetime-local"
                {...register('flight.scheduledArrival', { required: 'Scheduled arrival is required' })}
                error={errors.flight?.scheduledArrival?.message}
                required
              />

              <Input
                label="Actual Arrival Time"
                type="datetime-local"
                {...register('flight.actualArrival')}
              />
            </div>

            <Checkbox
              id="isCancelled"
              label="Flight was cancelled"
              {...register('flight.isCancelled')}
            />

            {watch('flight.isCancelled') && (
              <Textarea
                label="Cancellation Reason"
                rows={3}
                placeholder="Reason provided by airline (if any)"
                {...register('flight.cancellationReason')}
              />
            )}

            <div className="flex justify-end">
              <Button type="button" onClick={() => setCurrentStep(2)}>
                Next: Passenger Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Passenger Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Passenger Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('passenger.firstName', { required: 'First name is required' })}
                error={errors.passenger?.firstName?.message}
                required
              />

              <Input
                label="Last Name"
                {...register('passenger.lastName', { required: 'Last name is required' })}
                error={errors.passenger?.lastName?.message}
                required
              />

              <Input
                label="Email Address"
                type="email"
                {...register('passenger.email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.passenger?.email?.message}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                {...register('passenger.phone')}
              />

              <Input
                label="Address"
                {...register('passenger.address')}
              />

              <Input
                label="City"
                {...register('passenger.city')}
              />

              <Input
                label="Postal Code"
                {...register('passenger.postalCode')}
              />

              <Input
                label="Country"
                {...register('passenger.country')}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={() => setCurrentStep(3)}>
                Next: Documents
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Documents</h2>
            
            <FileUpload
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
            />

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button type="button" onClick={() => setCurrentStep(4)}>
                Next: Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Review & Submit</h2>
            
            {/* GDPR Consent */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Checkbox
                id="gdprConsent"
                label={
                  <>
                    <strong>GDPR Consent *</strong><br />
                    I consent to the processing of my personal data in accordance with GDPR regulations 
                    for the purpose of processing my flight compensation claim.
                  </>
                }
                {...register('gdprConsent', {
                  required: 'You must consent to data processing'
                })}
                error={errors.gdprConsent?.message}
              />
            </div>

            {/* POA Consent */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Checkbox
                id="poaConsent"
                label={
                  <>
                    <strong>Power of Attorney (POA) *</strong><br />
                    I authorize this platform to act on my behalf in communicating with the airline 
                    and pursuing my compensation claim under EU Regulation 261/2004.
                  </>
                }
                {...register('poaConsent', {
                  required: 'You must consent to Power of Attorney'
                })}
                error={errors.poaConsent?.message}
              />
            </div>

            {/* Summary */}
            <Card className="bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Claim Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight:</span>
                  <span className="font-medium">{watch('flight.flightNumber')} - {watch('flight.airline')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{watch('flight.departureAirport')} → {watch('flight.arrivalAirport')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passenger:</span>
                  <span className="font-medium">{watch('passenger.firstName')} {watch('passenger.lastName')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents:</span>
                  <span className="font-medium">{uploadedFiles.length} file(s)</span>
                </div>
              </div>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
              <Button
                type="submit"
                disabled={!gdprConsent || !poaConsent}
              >
                Submit Claim
              </Button>
            </div>
          </div>
        )}
        </Card>
      </form>
    </div>
  )
}

