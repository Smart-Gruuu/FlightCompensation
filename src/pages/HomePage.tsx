import { Link } from 'react-router-dom'
import { FileText, CheckCircle, TrendingUp, Shield } from 'lucide-react'
import { Button, Card } from '../components'

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: 'File Your Claim',
      description: 'Submit your flight delay or cancellation claim in minutes with our easy-to-use form.',
      link: '/claim/new',
      linkText: 'Start Claim'
    },
    {
      icon: CheckCircle,
      title: 'Check Eligibility',
      description: 'Quickly check if your flight is eligible for compensation under EU261 regulations.',
      link: '/eligibility/check',
      linkText: 'Check Now'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your claim status and track communications with airlines in real-time.',
      link: '/dashboard',
      linkText: 'View Dashboard'
    },
    {
      icon: Shield,
      title: 'EU261 Protected',
      description: 'Full compliance with EU Regulation 261/2004 for flight delay and cancellation compensation.',
      link: '/eligibility/check',
      linkText: 'Learn More'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Claim Your Flight Compensation
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Under EU Regulation 261/2004, you may be entitled to compensation for flight delays, 
          cancellations, or denied boarding. Get up to €600 in compensation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/claim/new">
            <Button size="lg" className="w-full sm:w-auto">
              File a New Claim
            </Button>
          </Link>
          <Link to="/eligibility/check">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Check Eligibility
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} hover>
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <Link
                to={feature.link}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                {feature.linkText} →
              </Link>
            </Card>
          )
        })}
      </div>

      {/* EU261 Information */}
      <Card className="bg-primary-50 border border-primary-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          EU261 Compensation Rules
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">€250</div>
            <p className="text-gray-700">
              Flights ≤ 1,500 km<br />
              (delayed ≥ 3 hours or cancelled)
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">€400</div>
            <p className="text-gray-700">
              Flights &gt; 1,500 km within EU<br />
              (delayed ≥ 3 hours or cancelled)
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">€600</div>
            <p className="text-gray-700">
              Flights &gt; 3,500 km<br />
              (delayed ≥ 4 hours or cancelled)
            </p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-primary-200">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Compensation is not payable if the delay/cancellation was caused 
            by extraordinary circumstances beyond the airline's control (e.g., severe weather, 
            security risks, air traffic control restrictions).
          </p>
        </div>
      </Card>
    </div>
  )
}

