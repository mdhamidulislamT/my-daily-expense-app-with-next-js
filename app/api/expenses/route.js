import prisma from '../../lib/prisma'

// ✅ Create expense
export async function POST(req) {
  try {
    const body = await req.json()
    const { date, source, note, amount, type } = body

    const amt = parseFloat(amount)
    if (Number.isNaN(amt) || amt <= 0)
      return new Response('Amount must be positive', { status: 400 })

    if (!['in', 'out'].includes(type))
      return new Response('Invalid type', { status: 400 })

    // Round to 2 decimals
    const roundedAmount = Math.round(amt * 100) / 100

    const expense = await prisma.expense.create({
      data: {
        date: new Date(date),
        source: source || null,
        note: note || null,
        amount: roundedAmount,
        type,
      },
    })

    return Response.json({ ...expense, amount: Number(expense.amount) })
  } catch (e) {
    console.error(e)
    return new Response('Failed to create', { status: 500 })
  }
}

// ✅ Get all expenses
export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    })
    return Response.json(
      expenses.map(e => ({ ...e, amount: Number(e.amount) }))
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to fetch', { status: 500 })
  }
}
