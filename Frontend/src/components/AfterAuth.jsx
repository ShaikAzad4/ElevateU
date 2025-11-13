// // AfterAuth.jsx
// import { useEffect } from "react";
// import { useUser, useAuth } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";

// export default function AfterAuth() {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const { getToken } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoaded || !isSignedIn) return;

//     (async () => {
//       const token = await getToken().catch(() => null);
//       await fetch("http://localhost:5000/api/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify({
//           id: user.id,
//           email: user.primaryEmailAddress?.emailAddress || null,
//           name: user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
//         }),
//       });
//     })();
//   }, [isLoaded, isSignedIn, user, getToken]);
//   return navigate('/mycourse')
// }



// AfterAuth.jsx
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function AfterAuth() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    (async () => {
      const token = await getToken().catch(() => null);
      try {
        // Create/sync user in backend
        await fetch(`${API_BASE}/user/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress || null,
            name:
              user.fullName ||
              `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          }),
        });

        // Normalize name for comparison
        const name =
          (user.fullName ||
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
            "").toLowerCase();

        // ✅ Conditional navigation
        if (name === "admin") {
          navigate("/admin");
        } else {
          navigate("/courses");
        }
      } catch (err) {
        console.error("Error syncing user:", err);
        navigate("/courses"); // fallback
      }
    })();
  }, [isLoaded, isSignedIn, user, getToken, navigate]);

  return null; // no UI — just redirects
}
