"use client";
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react"



const RestaurantMenu = () => {
  const params = useParams();
  const pathName = usePathname();
  const pName = pathName.split("/").pop();
  const bUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/${params ? params.id : ""}`;
  const clickClose = () => {
    const sideMenu = document.querySelector('aside');
    sideMenu.style.animation = "hideMenu 0.4s ease forwards";
  }
  return (
    <aside>
      <div class="toggle transform transition-transform duration-300 hover:scale-110">
        <div class="logo flex items-center">
          <h2 class="text-2xl ml-4"><span class="text-red-500">Joyfulwait</span></h2>
        </div>
      </div>
      <div className="sidebar">
        <a className='cursor-pointer' onClick={() => window.history.back()}>
          <span className="material-symbols-outlined">home</span><h3>Home</h3>
        </a>
        <a className='cursor-pointer' href={`/`}>
          <span className="material-symbols-outlined">restaurant</span><h3>Restaurant</h3>
        </a>
        <a className='cursor-pointer' onClick={() => signOut()}>
          <span className="material-symbols-outlined">logout</span><h3>Logout</h3>
        </a>
      </div>
    </aside>
  );
};

export default RestaurantMenu;
