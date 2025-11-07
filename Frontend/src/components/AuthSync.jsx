import { useEffect, useRef } from 'react';
import { useUser, useSession } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function syncUserToBackend(sessionToken, user) {
  await fetch(`${API_BASE_URL}/api/users/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      clerk_id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      name: user.fullName || user.firstName || '',
    }),
  });
}

export default function AuthSync() {
  const { user, isLoaded: userLoaded } = useUser();
  const { session, isLoaded: sessionLoaded } = useSession();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current) return;
    if (!userLoaded || !sessionLoaded) return;
    if (!user || !session) return;

    session.getToken().then((token) => {
      if (!token) return;
      syncedRef.current = true;
      syncUserToBackend(token, user).catch(() => {
        syncedRef.current = false;
      });
    });
  }, [user, session, userLoaded, sessionLoaded]);

  return null;
}


