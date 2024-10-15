import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email, emailVerified: false },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // check if already send a verification email
  const alreadySent = await prisma.verificationToken.findFirst({
    where: { identifier: user.email },
  });
  if (alreadySent) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email },
    });
  }
  // Send the verification email
  await sendVerificationEmail(user.email);

  return NextResponse.json({ message: "Verification email sent" });
}
