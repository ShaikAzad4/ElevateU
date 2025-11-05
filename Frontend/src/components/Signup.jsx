import { SignUp } from "@clerk/clerk-react";

export default function SigningUp() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/courses" />
    </div>
  );
}
