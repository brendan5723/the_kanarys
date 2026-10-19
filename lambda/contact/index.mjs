import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'node:crypto'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
    body: JSON.stringify(body),
  }
}

export function validatePayload(raw) {
  if (raw && typeof raw.company === 'string' && raw.company.trim() !== '') {
    return { error: 'rejected', statusCode: 400 }
  }

  const name = typeof raw?.name === 'string' ? raw.name.trim() : ''
  const email = typeof raw?.email === 'string' ? raw.email.trim() : ''
  const message = typeof raw?.message === 'string' ? raw.message.trim() : ''

  if (!name || name.length > 120) {
    return { error: 'Name is required (max 120 characters).', statusCode: 400 }
  }
  if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
    return { error: 'A valid email is required.', statusCode: 400 }
  }
  if (!message || message.length > 4000) {
    return { error: 'Message is required (max 4000 characters).', statusCode: 400 }
  }

  return { value: { name, email, message } }
}

function parseBody(event) {
  if (!event?.body) {
    return {}
  }
  const text = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body
  return JSON.parse(text)
}

export async function handler(event, _context, deps = {}) {
  const method = event?.requestContext?.http?.method || event?.httpMethod || 'POST'
  if (method === 'OPTIONS') {
    return json(204, {})
  }
  if (method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' })
  }

  let raw
  try {
    raw = parseBody(event)
  } catch {
    return json(400, { ok: false, error: 'Body must be JSON.' })
  }

  const checked = validatePayload(raw)
  if (checked.error) {
    console.log(JSON.stringify({ level: 'warn', msg: 'validation_failed', error: checked.error }))
    return json(checked.statusCode, { ok: false, error: checked.error === 'rejected' ? 'Invalid request.' : checked.error })
  }

  const id = randomUUID()
  const createdAt = new Date().toISOString()
  const item = { id, createdAt, ...checked.value }

  const tableName = process.env.CONTACT_TABLE
  const fromAddress = process.env.SES_FROM
  const toAddress = process.env.SES_TO

  try {
    if (tableName) {
      const ddb =
        deps.ddb ||
        DynamoDBDocumentClient.from(new DynamoDBClient({}))
      await ddb.send(
        new PutCommand({
          TableName: tableName,
          Item: item,
        }),
      )
    }

    if (fromAddress && toAddress) {
      try {
        const ses = deps.ses || new SESClient({})
        await ses.send(
          new SendEmailCommand({
            Source: fromAddress,
            Destination: { ToAddresses: [toAddress] },
            Message: {
              Subject: { Data: `Kanarys site: message from ${checked.value.name}` },
              Body: {
                Text: {
                  Data: `From: ${checked.value.name} <${checked.value.email}>\n\n${checked.value.message}`,
                },
              },
            },
          }),
        )
      } catch (err) {
        if (!tableName) {
          throw err
        }
        console.log(
          JSON.stringify({
            level: 'error',
            msg: 'ses_failed_stored_in_ddb',
            id,
            error: err instanceof Error ? err.message : String(err),
          }),
        )
      }
    }

    if (!tableName && !(fromAddress && toAddress)) {
      console.log(JSON.stringify({ level: 'info', msg: 'contact_local_only', item }))
    } else {
      console.log(JSON.stringify({ level: 'info', msg: 'contact_accepted', id }))
    }

    return json(200, { ok: true })
  } catch (err) {
    console.log(
      JSON.stringify({
        level: 'error',
        msg: 'contact_failed',
        error: err instanceof Error ? err.message : String(err),
      }),
    )
    return json(500, { ok: false, error: 'Could not send the message.' })
  }
}
