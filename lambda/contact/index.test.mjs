import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handler, validatePayload } from './index.mjs'

test('rejects empty fields', () => {
  const result = validatePayload({ name: '', email: 'a@b.com', message: 'hi' })
  assert.equal(result.statusCode, 400)
})

test('rejects bad email', () => {
  const result = validatePayload({ name: 'Brendan', email: 'not-an-email', message: 'hello' })
  assert.equal(result.statusCode, 400)
})

test('rejects honeypot', () => {
  const result = validatePayload({
    name: 'Bot',
    email: 'bot@example.com',
    message: 'spam',
    company: 'Acme',
  })
  assert.equal(result.error, 'rejected')
})

test('accepts a valid payload', () => {
  const result = validatePayload({
    name: 'Conor',
    email: 'conor@example.com',
    message: 'Gig?',
  })
  assert.deepEqual(result.value, {
    name: 'Conor',
    email: 'conor@example.com',
    message: 'Gig?',
  })
})

test('handler stores and emails on POST', async () => {
  const calls = { ddb: 0, ses: 0 }
  const ddb = {
    send: async () => {
      calls.ddb += 1
    },
  }
  const ses = {
    send: async () => {
      calls.ses += 1
    },
  }

  process.env.CONTACT_TABLE = 'contacts'
  process.env.SES_FROM = 'band@example.com'
  process.env.SES_TO = 'band@example.com'

  const response = await handler(
    {
      requestContext: { http: { method: 'POST' } },
      body: JSON.stringify({
        name: 'Cormac',
        email: 'cormac@example.com',
        message: 'Drums check',
      }),
    },
    {},
    { ddb, ses },
  )

  assert.equal(response.statusCode, 200)
  assert.equal(JSON.parse(response.body).ok, true)
  assert.equal(calls.ddb, 1)
  assert.equal(calls.ses, 1)
})

test('handler still succeeds when SES fails but DynamoDB wrote', async () => {
  process.env.CONTACT_TABLE = 'contacts'
  process.env.SES_FROM = 'band@example.com'
  process.env.SES_TO = 'band@example.com'

  const response = await handler(
    {
      requestContext: { http: { method: 'POST' } },
      body: JSON.stringify({
        name: 'Brendan',
        email: 'brendan@example.com',
        message: 'Keys check',
      }),
    },
    {},
    {
      ddb: { send: async () => {} },
      ses: {
        send: async () => {
          throw new Error('MessageRejected')
        },
      },
    },
  )

  assert.equal(response.statusCode, 200)
  assert.equal(JSON.parse(response.body).ok, true)
})

test('handler returns 400 for invalid JSON', async () => {
  const response = await handler({
    requestContext: { http: { method: 'POST' } },
    body: '{',
  })
  assert.equal(response.statusCode, 400)
})
