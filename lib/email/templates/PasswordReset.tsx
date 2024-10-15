import { Html } from "@react-email/components";

interface PasswordResetProps {
  resetUrl: string;
}

const PasswordReset = ({ resetUrl }: PasswordResetProps) => (
  <Html>
    <div>
      <h1>Reset Your Password</h1>
      <p>To reset your password, please click the link below:</p>
      <a href={resetUrl}>Reset Password</a>
    </div>
  </Html>
);
export default PasswordReset;
