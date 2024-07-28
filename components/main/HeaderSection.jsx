import Image from "next/image";
import bannerImage from '@/public/images/preview-img.jpg';
import logoImage from '@/public/images/logo.png';  // Import the logo image
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HeaderSection = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      <Image src={bannerImage} alt="Banner" className="w-full h-80 object-cover" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center px-4 md:px-8">
          <h1 className="text-4xl font-bold md:text-5xl">No More Queue Line, For You</h1>
          <p className="mt-2 text-lg md:text-xl">Quickly and conveniently search and book restaurant tables online. With just one click, you can check table availability.</p>
        </div>
      </div>
      <div className={`fixed top-0 left-0 right-0 flex items-center justify-between p-4 backdrop-blur bg-white/10 transition duration-300 z-50 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="flex items-center space-x-2">
          <Image src={logoImage} alt="Logo" className="h-10 w-auto" />  {/* Logo image */}
          <div className="text-2xl font-bold text-white">Joyfulwait</div>  {/* Text logo */}
        </div>
        {!session ? (
          <div className="flex items-center">
            <button 
              onClick={goToLogin} 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded mr-4 transition duration-300"
            >
              Login
            </button>
            <button 
              onClick={goToRegister} 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition duration-300"
            >
              Register
            </button>
          </div>
        ) : (
          <div className="text-white">
            Logged in as {session.user.email}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
