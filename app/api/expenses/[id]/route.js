import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title, amount } = await req.json();
  const expense = await prisma.expense.update({
    where: { id: Number(params.id) },
    data: { title, amount: parseFloat(amount) },
  });
  return Response.json(expense);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await prisma.expense.delete({ where: { id: Number(params.id) } });
  return new Response("Deleted", { status: 200 });
}
