import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Appointments } from './pages/Appointments'
import { CustomerNeeds } from './pages/CustomerNeeds'
import { Dashboard } from './pages/Dashboard'
import { ExperiencePortal } from './pages/ExperiencePortal'
import { NotFound } from './pages/NotFound'
import { ProductKnowledge } from './pages/ProductKnowledge'
import { ServiceRecords } from './pages/ServiceRecords'

const workspace = (page: React.ReactNode) => <AppShell>{page}</AppShell>

export function App() {
  return <Routes>
    <Route path="/" element={<ExperiencePortal />} />
    <Route path="/advisor" element={<Navigate to="/advisor/dashboard" replace />} />
    <Route path="/advisor/dashboard" element={workspace(<Dashboard />)} />
    <Route path="/advisor/appointments" element={workspace(<Appointments />)} />
    <Route path="/advisor/customers" element={workspace(<CustomerNeeds />)} />
    <Route path="/advisor/products" element={workspace(<ProductKnowledge />)} />
    <Route path="/advisor/records" element={workspace(<ServiceRecords />)} />
    <Route path="*" element={<NotFound />} />
  </Routes>
}
