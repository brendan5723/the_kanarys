import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Home } from './Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home', () => {
  it('renders hero heading with member names', () => {
    renderHome()
    expect(screen.getByRole('heading', { name: 'Brendan, Conor, Cormac' })).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderHome()
    expect(screen.getByText('Blues rock from Armagh City')).toBeInTheDocument()
  })

  it('renders Listen and Get in touch links', () => {
    renderHome()
    expect(screen.getByRole('link', { name: 'Listen' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get in touch' })).toBeInTheDocument()
  })
})
