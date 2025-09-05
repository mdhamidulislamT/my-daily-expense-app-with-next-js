import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const id = parseInt(params.id);

  const expense = await prisma.expense.updateMany({
    where: { id, userId: session.user.id },
    data: {
      date: new Date(body.date),
      source: body.source || null,
      note: body.note || null,
      amount: parseFloat(body.amount),
      type: body.type,
    },
  });

  if (expense.count === 0) return new Response("Not found or unauthorized", { status: 404 });
  return new Response(JSON.stringify(expense), { status: 200 });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const id = parseInt(params.id);

  const expense = await prisma.expense.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (expense.count === 0) return new Response("Not found or unauthorized", { status: 404 });
  return new Response(null, { status: 204 });
}
