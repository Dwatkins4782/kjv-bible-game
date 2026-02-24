import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', icon: '\u{1F3E0}' },
  { to: '/memorize', label: 'Memorize', icon: '\u{1F9E0}' },
  { to: '/lessons', label: 'Lessons', icon: '\u{1F4D6}' },
  { to: '/quiz', label: 'Quiz', icon: '\u{1F4DD}' },
  { to: '/account', label: 'Account', icon: '\u{1F464}' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
