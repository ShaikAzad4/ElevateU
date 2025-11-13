// ProtectedRoute.jsx
import React from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn
          redirectUrl={window.location.pathname + window.location.search}
          signInUrl="/login"
          signUpUrl="/sign-up"
        />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
