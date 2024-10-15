"use server";
import nodemailer from "nodemailer";
import prisma from "@/lib/db";
import crypto from "crypto";

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email verification link
export async function sendVerificationEmail(email: string) {
  const token = crypto.randomBytes(32).toString("hex");

  // Save verification token in the database
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  const emailHtml = `
    <div>
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email Address",
    html: emailHtml,
  });
}

// Send password reset link
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const emailHtml = `
    <div>
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: emailHtml,
  });
}
