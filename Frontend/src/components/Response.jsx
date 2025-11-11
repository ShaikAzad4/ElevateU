import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function Response() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      if (!isSignedIn) return;
      const token = await getToken();
      await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clerk_user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName
        }),
      });
    })();
  }, [isSignedIn]);

  return <div>Welcome {user?.fullName}</div>;
}
