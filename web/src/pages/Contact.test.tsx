import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Contact } from './Contact'

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  )
}

describe('Contact', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders name, email, message fields and submit button', () => {
    renderContact()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })

  it('shows validation error when submitting with empty fields', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(screen.getByText('Name, email, and message are required.')).toBeInTheDocument()
  })

  it('shows success message on successful submission', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    )
    renderContact()

    await user.type(screen.getByLabelText('Name'), 'Brendan')
    await user.type(screen.getByLabelText('Email'), 'brendan@test.com')
    await user.type(screen.getByLabelText('Message'), 'Hello there')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText('Sent. We will get back to you.')).toBeInTheDocument()
    })
  })

  it('shows error message on failed submission', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: 'Server error' }), { status: 500 }),
    )
    renderContact()

    await user.type(screen.getByLabelText('Name'), 'Brendan')
    await user.type(screen.getByLabelText('Email'), 'brendan@test.com')
    await user.type(screen.getByLabelText('Message'), 'Hello there')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })

  it('disables button and shows Sending… during submission', async () => {
    const user = userEvent.setup()
    let resolveFetch: (value: Response) => void
    vi.mocked(fetch).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve
      }),
    )
    renderContact()

    await user.type(screen.getByLabelText('Name'), 'Brendan')
    await user.type(screen.getByLabelText('Email'), 'brendan@test.com')
    await user.type(screen.getByLabelText('Message'), 'Hello there')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    const button = screen.getByRole('button', { name: 'Sending…' })
    expect(button).toBeDisabled()

    resolveFetch!(new Response(JSON.stringify({ ok: true }), { status: 200 }))

    await waitFor(() => {
      expect(screen.getByText('Sent. We will get back to you.')).toBeInTheDocument()
    })
  })
})
