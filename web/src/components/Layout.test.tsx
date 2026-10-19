import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Layout } from './Layout'

function renderLayout() {
  return render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>,
  )
}

describe('Layout', () => {
  it('displays the brand name', () => {
    renderLayout()
    expect(screen.getByText('The Kanarys')).toBeInTheDocument()
  })

  it('renders all 5 nav links with correct labels', () => {
    renderLayout()
    const expectedLinks = ['Home', 'About', 'Photos', 'Music', 'Contact']
    for (const label of expectedLinks) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('renders footer with band name and hometown', () => {
    renderLayout()
    expect(screen.getByText('The Kanarys · Armagh, Northern Ireland')).toBeInTheDocument()
  })
})
