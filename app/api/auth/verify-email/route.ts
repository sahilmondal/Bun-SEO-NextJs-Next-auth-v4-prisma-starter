import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Invalid or missing token" },
      { status: 400 }
    );
  }

  // Find the reset token
  const resetToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: resetToken.identifier },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Update the user's email verification status
  const res = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });
  if (!res) {
    return NextResponse.json(
      { error: "email verification failed" },
      { status: 404 }
    );
  }
  return NextResponse.json({ message: "Email verified successfully" });
}
