import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return new Response("User already exists", { status: 400 });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashedPassword } });
  return new Response(JSON.stringify({ id: user.id, email: user.email }), { status: 201 });
}
