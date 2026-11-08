import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'wishes.json')

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

const defaultWishes = [
  {
    id: '1',
    name: 'The Akinnibosun Family',
    location: 'Lagos, Nigeria',
    message: 'May your union be blessed with unending joy, peace, and abundance. We are so proud of you both and pray God’s favor guides your new home!',
    date: 'November 2026',
    heartCount: 14,
  },
  {
    id: '2',
    name: 'Pastor & Mrs. Akinde',
    location: 'Ogun State, Nigeria',
    message: 'Congratulations our beloved Odunayo and Ibitayo! As you step into holy matrimony, may God’s presence never depart from your home.',
    date: 'November 2026',
    heartCount: 19,
  },
  {
    id: '3',
    name: 'Uncle Tunde & Family',
    location: 'London, UK',
    message: 'Warmest congratulations all the way from the UK! What God has joined together, let no man put asunder. Wishing you a lifetime of laughter and shared dreams.',
    date: 'November 2026',
    heartCount: 11,
  },
]

// 1. Upstash Redis Cloud Helpers
async function getUpstashWishes() {
  if (!upstashUrl || !upstashToken) return null

  try {
    const res = await fetch(`${upstashUrl}/lrange/wedding_wishes/0/-1`, {
      headers: {
        Authorization: `Bearer ${upstashToken}`,
      },
      cache: 'no-store',
    })
    const data = await res.json()
    if (data.result && Array.isArray(data.result) && data.result.length > 0) {
      return data.result.map((item: any) => (typeof item === 'string' ? JSON.parse(item) : item))
    }
  } catch (error) {
    console.error('Upstash fetch error:', error)
  }
  return null
}

async function addUpstashWish(wish: any) {
  if (!upstashUrl || !upstashToken) return false

  try {
    const res = await fetch(upstashUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['LPUSH', 'wedding_wishes', JSON.stringify(wish)]),
    })
    const data = await res.json()
    return !!data.result
  } catch (error) {
    console.error('Upstash push error:', error)
    return false
  }
}

async function deleteUpstashWish(wishId: string) {
  if (!upstashUrl || !upstashToken) return null

  try {
    // 1. Fetch current list of wishes
    const res = await fetch(`${upstashUrl}/lrange/wedding_wishes/0/-1`, {
      headers: {
        Authorization: `Bearer ${upstashToken}`,
      },
      cache: 'no-store',
    })
    const data = await res.json()
    if (!data.result || !Array.isArray(data.result)) return null

    const parsedItems = data.result.map((item: any) =>
      typeof item === 'string' ? JSON.parse(item) : item
    )

    // 2. Filter out the target wish
    const remaining = parsedItems.filter((w: any) => String(w.id) !== String(wishId))

    // 3. Clear the key in Redis
    await fetch(`${upstashUrl}/del/wedding_wishes`, {
      headers: {
        Authorization: `Bearer ${upstashToken}`,
      },
    })

    // 4. Re-insert remaining items in order if any exist
    if (remaining.length > 0) {
      const pushCommand = [
        'RPUSH',
        'wedding_wishes',
        ...remaining.map((item: any) => JSON.stringify(item)),
      ]
      await fetch(upstashUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pushCommand),
      })
    }

    return remaining
  } catch (error) {
    console.error('Upstash delete error:', error)
    return null
  }
}

// 2. Local Fallback Helpers
function getLocalWishes() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error reading local wishes:', error)
  }
  return defaultWishes
}

function saveLocalWishes(wishes: any[]) {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(wishes, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error saving local wishes:', error)
    return false
  }
}

function deleteLocalWish(wishId: string) {
  try {
    const current = getLocalWishes()
    const remaining = current.filter((w: any) => String(w.id) !== String(wishId))
    saveLocalWishes(remaining)
    return remaining
  } catch (error) {
    console.error('Error deleting local wish:', error)
    return null
  }
}

// GET /api/wishes
export async function GET() {
  // Try Upstash first
  const cloudWishes = await getUpstashWishes()
  if (cloudWishes && cloudWishes.length > 0) {
    return NextResponse.json({ wishes: cloudWishes, source: 'upstash' })
  }

  // Fallback to local file
  const localWishes = getLocalWishes()
  return NextResponse.json({ wishes: localWishes, source: 'local' })
}

// POST /api/wishes
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, location, message } = body

    if (!name || !message || typeof name !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 })
    }

    const newWish = {
      id: Date.now().toString(),
      name: name.trim().slice(0, 100),
      location: (location || 'Well-wisher').trim().slice(0, 80),
      message: message.trim().slice(0, 600),
      date: 'Just now',
      heartCount: 1,
    }

    // Try saving to Upstash Redis
    let savedToUpstash = false
    if (upstashUrl && upstashToken) {
      savedToUpstash = await addUpstashWish(newWish)
    }

    // Save to local file as well (for dev/backup)
    const currentLocal = getLocalWishes()
    const updatedLocal = [newWish, ...currentLocal]
    saveLocalWishes(updatedLocal)

    if (savedToUpstash) {
      const latestCloud = (await getUpstashWishes()) || updatedLocal
      return NextResponse.json({ success: true, wish: newWish, wishes: latestCloud, source: 'upstash' })
    }

    return NextResponse.json({ success: true, wish: newWish, wishes: updatedLocal, source: 'local' })
  } catch (error) {
    console.error('Failed to submit wish:', error)
    return NextResponse.json({ error: 'Failed to submit wish' }, { status: 500 })
  }
}

// DELETE /api/wishes - Admin deletion of unwanted wishes with PIN verification
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id, adminPin } = body

    const expectedPin = process.env.ADMIN_WISHES_PIN || '2026'

    if (!adminPin || String(adminPin).trim() !== String(expectedPin).trim()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin PIN' }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ error: 'Wish ID is required' }, { status: 400 })
    }

    // Delete locally
    const updatedLocal = deleteLocalWish(id)

    // Delete in Upstash Redis
    let updatedCloud = null
    if (upstashUrl && upstashToken) {
      updatedCloud = await deleteUpstashWish(id)
    }

    const latestWishes = updatedCloud && Array.isArray(updatedCloud) ? updatedCloud : updatedLocal || []

    return NextResponse.json({
      success: true,
      message: 'Wish deleted successfully',
      wishes: latestWishes,
    })
  } catch (error) {
    console.error('Failed to delete wish:', error)
    return NextResponse.json({ error: 'Failed to delete wish' }, { status: 500 })
  }
}
