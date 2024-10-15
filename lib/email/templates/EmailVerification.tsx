import { Html } from "@react-email/components";

interface EmailVerificationProps {
  verificationUrl: string;
}

const EmailVerification = ({ verificationUrl }: EmailVerificationProps) => (
  <Html>
    <div>
      <h1>Verify Your Email</h1>
      <p>To verify your email address, please click the link below:</p>
      <a href={verificationUrl}>Verify Email</a>
    </div>
  </Html>
);
export default EmailVerification;
