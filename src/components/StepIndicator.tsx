import { CheckCircle } from 'lucide-react'
import { clsx } from 'clsx'

interface Step {
  number: number
  title: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors',
                  currentStep > step.number
                    ? 'bg-green-600 text-white'
                    : currentStep === step.number
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                )}
              >
                {currentStep > step.number ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  step.number
                )}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  'flex-1 h-1 mx-2 transition-colors',
                  currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

