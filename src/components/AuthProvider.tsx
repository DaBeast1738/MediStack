'use client'

import { useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase'; // Ensure correct path
import { onAuthStateChanged, User } from 'firebase/auth';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user ? (
        <p>Welcome, {user.displayName || user.email}</p>
      ) : (
        <p>Please log in.</p>
      )}
      {children}
    </div>
  );
}
