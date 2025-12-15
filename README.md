# Flight Compensation Platform - EU261 (Frontend)

A professional flight delay & cancellation compensation platform frontend operating under EU Regulation 261/2004 (EU261), similar to Skycop, Flightright, and AirHelp.

## Features

### ✅ Claim Intake System
- Flight details submission (flight number, date, route)
- Passenger details management
- Document upload (boarding pass, booking confirmation)
- Power of Attorney (POA) handling
- GDPR-compliant data handling

### ✅ Flight Eligibility Check
- Real-time eligibility checking
- EU261 compensation rules display
- Flight distance-based compensation calculation (€250 / €400 / €600)
- Extraordinary circumstances handling

### ✅ Claim Dashboard
- Claim status pipeline visualization
- Document management
- Communication tracking
- Status history

## Tech Stack

- **Frontend**: React + TypeScript
- **UI Framework**: Tailwind CSS
- **Form Handling**: React Hook Form
- **State Management**: React Context / Zustand
- **Routing**: React Router
- **HTTP Client**: Axios

## Project Structure

```
FlightCompensation/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── contexts/       # React contexts
├── public/             # Static assets
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## EU261 Compensation Rules

- **€250**: Flights ≤ 1,500 km (delayed ≥ 3 hours or cancelled)
- **€400**: Flights > 1,500 km within EU (delayed ≥ 3 hours or cancelled)
- **€600**: Flights > 3,500 km (delayed ≥ 4 hours or cancelled)

## License

Proprietary - All rights reserved
