import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import CustomerList from './components/CustomerList'
import TrainingList from './components/TrainingList'
import CalendarPage from './components/CalendarPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <span className="brand">PT Manager</span>
        <NavLink to="/customers">Customers</NavLink>
        <NavLink to="/trainings">Trainings</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/trainings" element={<TrainingList />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
