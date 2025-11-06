import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <SignIn routing="path" path="/login" fallbackRedirectUrl="/after-auth" />
    </div>
  );
}
