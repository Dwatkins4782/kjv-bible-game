import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Memorize from './pages/Memorize'
import Quiz from './pages/Quiz'
import Browse from './pages/Browse'
import Stats from './pages/Stats'

export default function App() {
  return (
    <>
      <header className="app-header">
        <h1>KJV Bible Game</h1>
        <div className="subtitle">Study to shew thyself approved unto God &mdash; 2 Timothy 2:15</div>
      </header>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/memorize" className={({ isActive }) => isActive ? 'active' : ''}>Memorize</NavLink>
        <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''}>Quiz</NavLink>
        <NavLink to="/browse" className={({ isActive }) => isActive ? 'active' : ''}>Browse</NavLink>
        <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>Stats</NavLink>
      </nav>
      <main className="container" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memorize" element={<Memorize />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        King James Version &bull; All scripture is given by inspiration of God
      </footer>
    </>
  )
}
