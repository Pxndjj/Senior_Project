"use client"
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-4">Welcome to Joyfulwait</h1>
      {!session ? (
        <>
          <button onClick={goToLogin} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">Login</button>
          <button onClick={goToRegister} className="px-4 py-2 bg-green-500 text-white rounded">Register</button>
        </>
      ) : (
        <p>You are logged in as {session.user.email}</p>
      )}
    </main>
  );
}

