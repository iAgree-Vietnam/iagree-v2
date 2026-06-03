// pages/forgot-password/index.tsx
import ForgotPasswordScreen from "@/src/screens/PasswordScreen/ForgotPasswordScreen";

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
export const getServerSideProps = async () => ({ props: {} })
