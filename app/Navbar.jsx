"use client"
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
      <div className="flex items-center">
        <img src="J.png" alt="" className="h-10 mr-4" />
        <span className="text-white text-xl font-bold">Joyfulwait</span>
      </div>
      <div>
        {!session ? (
          <>
            <button onClick={goToLogin} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mr-4 transition duration-300">Login</button>
            <button onClick={goToRegister} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition duration-300">Register</button>
          </>
        ) : (
          <p className="text-white">Logged in as {session.user.email}</p>
        )}
      </div>
    </nav>
  );
}
