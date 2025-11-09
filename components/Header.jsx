'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function Header() {
  const router = useRouter();
  const [userEmail,setUserEmail]=useState(null); 




  // useEffect(() => {
  //   // Improved cookie check function
  //   const checkAuth = () => {
  //     const getCookie = (name) => {
  //       const value = `; ${document.cookie}`;
  //       const parts = value.split(`; ${name}=`);
  //       if (parts.length === 2) return parts.pop().split(';').shift();
  //     };
      
  //     const token = getCookie('token');
  //     const email = getCookie('userEmail');
  //     setIsAuthenticated(!!token && !!email);
  //   };

  //   // Check immediately
  //   checkAuth();

  //   // Check on focus/visibility change
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible') {
  //       checkAuth();
  //     }
  //   };
    
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   window.addEventListener('focus', checkAuth);

  //   // Set up interval to check auth status
  //   const interval = setInterval(checkAuth, 1000);

  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //     window.removeEventListener('focus', checkAuth);
  //     clearInterval(interval);
      
  //   };
  // }, []);

  // const handleLogout = async () => {
  //   try {
  //     await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  //   } catch (err) {
  //     // fallback to client-side cookie clear if API call fails
  //     document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  //     document.cookie = 'userEmail=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  //   }
  //   router.push('/login');
  // };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              FileHub
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {userEmail ? (
              <>
                <Link 
                  href="/dashboard" 
                  
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
             
                >
                  Profile
                </Link>
                <button
                 
                  className="bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}