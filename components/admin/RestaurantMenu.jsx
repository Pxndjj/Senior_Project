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
      <div className="toggle">
        <div className="logo">
          <img src="/images/next.svg" />
          <h2><span className="danger">RS</span></h2>
        </div>
        <div onClick={clickClose} className="close">
          <span className="material-symbols-outlined">close</span>
        </div>
      </div>
      <div className="sidebar">
        <a className={pName.length > 20 ? 'active' : ''} href={`${bUrl}`}>
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
