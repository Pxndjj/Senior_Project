import Image from "next/image";
import bannerImage from '@/public/images/preview-img.jpg';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


const HeaderSection = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="relative">
      <Image src={bannerImage} alt="Banner" className="w-full h-80 object-cover" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center px-4 md:px-8">
          <h1 className="text-4xl font-bold md:text-5xl">No More Queue Line, For You</h1>
          <p className="mt-2 text-lg md:text-xl">Quickly and conveniently search and book restaurant tables online. With just one click, you can check table availability.</p>
          <div>
            {!session ? (
              <>
                <button onClick={goToLogin} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded mr-4 transition duration-300 w-24">Login</button>

                {/* <button onClick={goToRegister} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition duration-300">Register</button> */}
              </>
            ) : (
              <p className="text-white">Logged in as {session.user.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
