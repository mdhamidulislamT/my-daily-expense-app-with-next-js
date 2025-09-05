import prisma from '../../../lib/prisma'

// ✅ Update
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()
    const { date, source, note, amount, type } = body

    const amt = parseFloat(amount)
    if (Number.isNaN(amt) || amt <= 0)
      return new Response('Amount must be positive', { status: 400 })

    if (!['in', 'out'].includes(type))
      return new Response('Invalid type', { status: 400 })

    const roundedAmount = Math.round(amt * 100) / 100

    const updated = await prisma.expense.update({
      where: { id },
      data: {
        date: new Date(date),
        source: source || null,
        note: note || null,
        amount: roundedAmount,
        type,
      },
    })

    return Response.json({ ...updated, amount: Number(updated.amount) })
  } catch (e) {
    console.error(e)
    return new Response('Failed to update', { status: 500 })
  }
}

// ✅ Delete
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id)
    await prisma.expense.delete({ where: { id } })
    return new Response('Deleted successfully', { status: 200 })
  } catch (e) {
    console.error(e)
    return new Response('Failed to delete', { status: 500 })
  }
}
