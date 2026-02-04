import React from 'react'
import { Link } from 'react-router-dom'
import '../Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Bright School</Link>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/report">Report an Item</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar