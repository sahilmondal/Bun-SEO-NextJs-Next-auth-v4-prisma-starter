import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

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

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  // Delete the reset token
  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ message: "Password has been reset successfully" });
}
