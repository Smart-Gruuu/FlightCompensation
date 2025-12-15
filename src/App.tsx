import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ClaimIntakePage from './pages/ClaimIntakePage'
import EligibilityCheckPage from './pages/EligibilityCheckPage'
import DashboardPage from './pages/DashboardPage'
import ClaimDetailPage from './pages/ClaimDetailPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/claim/new" element={<ClaimIntakePage />} />
          <Route path="/eligibility/check" element={<EligibilityCheckPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/claims/:id" element={<ClaimDetailPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

