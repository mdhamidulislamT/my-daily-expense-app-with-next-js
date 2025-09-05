import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const expenses = await prisma.expense.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });
  return new Response(JSON.stringify(expenses), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { date, source, note, amount, type } = await req.json();
  const expense = await prisma.expense.create({
    data: {
      date: new Date(date),
      source,
      note,
      amount: parseFloat(amount),
      type,
      userId: session.user.id,
    },
  });
  return new Response(JSON.stringify(expense), { status: 201 });
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = params;
  const { date, source, note, amount, type } = await req.json();
  const expense = await prisma.expense.update({
    where: { id: parseInt(id) },
    data: { date: new Date(date), source, note, amount: parseFloat(amount), type },
  });
  return new Response(JSON.stringify(expense), { status: 200 });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = params;
  await prisma.expense.delete({ where: { id: parseInt(id) } });
  return new Response(null, { status: 204 });
}
