'use client';
import SplashScreen from '@/app/components/splashscreen';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import config from '../../config';

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  // const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      const userData = parseJwt(token);
      setUser(userData);
      fetchUserData(token);

    } else {
      router.push('/');
    }
  }, [router, searchParams]);

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return (
        <Suspense fallback={<div>Loading...</div>}>
          JSON.parse(jsonPayload)
        </Suspense>
      )
    } catch (e) {
      return null;
    }
  }

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // setUserData(data.user);

      if(!data.user.userId){
        setTimeout(() => {
          router.push('/update-profile');
        }, 100);
      } else {
        router.push('/');
      }

      console.log('data fetched successfully:', data.user);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SplashScreen />
    </Suspense>
  );
};


