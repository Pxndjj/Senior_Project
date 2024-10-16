"use client";

import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();
    const excludedPaths = ['/login', '/register', '/restaurant'];

    if (excludedPaths.some(path => pathname.startsWith(path))) {
        return null;
    }
    return (
        <footer className="bg-black text-white py-6">
            <div className="container mx-auto text-center">
                <p className="text-lg font-semibold mb-4">JoyfulWait</p>
                <p className="text-sm mb-4">Providing a seamless dining experience. Find and book your favorite restaurants with ease.</p>
                <p className="text-sm">&copy; {new Date().getFullYear()} JoyfulWait. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
