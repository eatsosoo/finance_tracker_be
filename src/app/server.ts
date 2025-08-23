import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const app = new Hono()
const prisma = new PrismaClient()

app.get('/', (c) => c.text('Finance API running 🚀'))

// Test: lấy tất cả users
app.get('/users', async (c) => {
  const users = await prisma.user.findMany()
  return c.json(users)
})

export default app
