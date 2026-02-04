import React from 'react'
import '../site.css'

function HomePage() {
  return (
    <div>
      <header className="header">
        <nav className="navbar container">
          <div className="nav-brand">Bright School Lost & Found</div>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#report">Report Item</a></li>
            <li><a href="#search">Search Items</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content container">
          <h1>LOST SOMETHING? <br/> FOUND SOMETHING?</h1>
          <p>Help reunite lost items with their owners in our Bright School community</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">+ REPORT ITEM</button>
            <button className="btn btn-secondary">🔍 SEARCH ITEMS</button>
          </div>

          <div className="items-gallery">
            <h3>Common Lost & Found Items</h3>
            <div className="items-grid">
              <div className="item-icon"><i>📚</i><span>Textbooks</span></div>
              <div className="item-icon"><i>🧑‍🎓</i><span>Student ID</span></div>
              <div className="item-icon"><i>👕</i><span>Clothing</span></div>
              <div className="item-icon"><i>📱</i><span>Electronics</span></div>
              <div className="item-icon"><i>🔑</i><span>Keys</span></div>
              <div className="item-icon"><i>⚽</i><span>Sports Gear</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage