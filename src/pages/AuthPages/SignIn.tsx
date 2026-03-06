import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="IDL | Sign In"
        description="Sign in to your account to access the IDL Financial Management Dashboard. Enter your email and password to get started!"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
