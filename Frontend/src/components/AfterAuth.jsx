// AfterAuth.jsx
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function AfterAuth() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    (async () => {
      const token = await getToken().catch(() => null);
      await fetch("http://localhost:5000/api/echo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || null,
          name: user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        }),
      });
    })();
  }, [isLoaded, isSignedIn, user, getToken]);
  return navigate('/mycourse')
}
