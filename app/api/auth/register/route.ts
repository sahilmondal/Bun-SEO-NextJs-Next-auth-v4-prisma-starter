import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: "User created successfully" });
}
