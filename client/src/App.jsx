import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './pages/Navbar.jsx'

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default App