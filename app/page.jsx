"use client"
import Navbar from './Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen pt-16">
        <h1 className="text-4xl mb-4">Welcome to Joyfulwait</h1>
        <img src="J.png" alt="" className="" />
      </main>
    </div>
  );
}
