import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
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

  const body = await req.json();
  const expense = await prisma.expense.create({
    data: {
      date: new Date(body.date),
      source: body.source || null,
      note: body.note || null,
      amount: parseFloat(body.amount),
      type: body.type,
      user: { connect: { id: session.user.id } },
    },
  });
  return new Response(JSON.stringify(expense), { status: 201 });
}
