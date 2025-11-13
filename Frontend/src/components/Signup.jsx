import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <SignUp routing="path" path="/sign-up" afterSignUpUrl="/after-auth" />
    </div>
  );
}
