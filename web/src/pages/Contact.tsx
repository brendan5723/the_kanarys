import { type FormEvent, useState } from 'react'

const contactUrl = import.meta.env.VITE_CONTACT_URL || '/contact'

type Status = 'idle' | 'sending' | 'ok' | 'error'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: String(data.get('message') || '').trim(),
      company: String(data.get('company') || ''),
    }

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('error')
      setError('Name, email, and message are required.')
      return
    }

    setStatus('sending')
    setError('')

    try {
      const response = await fetch(contactUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!response.ok || !body.ok) {
        throw new Error(body.error || 'Could not send the message.')
      }
      setStatus('ok')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not send the message.')
    }
  }

  return (
    <article className="page">
      <p className="kicker">Contact</p>
      <h1>Bookings, hellos, old tapes</h1>
      <p className="lede">
        The form posts to a Lambda behind API Gateway. Locally it hits the same{' '}
        <code>/contact</code> path via the Vite proxy.
      </p>
      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <label>
          Name
          <input name="name" type="text" maxLength={120} autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" maxLength={200} autoComplete="email" required />
        </label>
        <label className="honeypot" aria-hidden="true">
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        <label>
          Message
          <textarea name="message" rows={6} maxLength={4000} required />
        </label>
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
        {status === 'ok' ? <p className="flash ok">Sent. We will get back to you.</p> : null}
        {status === 'error' ? <p className="flash err">{error}</p> : null}
      </form>
    </article>
  )
}
