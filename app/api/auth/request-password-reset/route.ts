import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email"; // Custom function for sending email
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate and save a password reset token
  const token = crypto.randomBytes(32).toString("hex");

  // Save password reset token in the database
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    },
  });
  // Send password reset email
  await sendPasswordResetEmail(email, token);

  return NextResponse.json({ message: "Password reset email sent" });
}
