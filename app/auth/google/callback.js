// pages/auth/google/callback.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token;
    if (token) {
      // Save the token to local storage or cookie
      localStorage.setItem('token', token);
      // Redirect to user page
      router.push('/homepage');
    }
  }, [router]);

  return <div>Loading...</div>;
}
