import { NavLink, Outlet } from 'react-router-dom'
import { band } from '../content'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/photos', label: 'Photos' },
  { to: '/music', label: 'Music' },
  { to: '/contact', label: 'Contact' },
]

export function Layout() {
  return (
    <div className="shell">
      <header className="site-header">
        <NavLink to="/" className="brand">
          {band.name}
        </NavLink>
        <nav aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          {band.name} · {band.hometown}
        </p>
        <p className="muted">Three friends. Blues rock. Never had a website — until now.</p>
      </footer>
    </div>
  )
}
