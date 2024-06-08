"use client";
import { useParams, useRouter, usePathname } from 'next/navigation';
const RestaurantMenu = () => {
  const params = useParams();
  const pathName = usePathname();
  const pName = pathName.split("/").pop();
  const bUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${params ? params.id : ""}`;
  const clickClose = () => {
    const sideMenu = document.querySelector('aside');
    sideMenu.style.animation = "hideMenu 0.4s ease forwards";
  }
  return (
    <aside>
      <div className="toggle">
        <div className="logo">
          <img src="/images/next.svg" />
          <h2><span className="danger">Joyfulwait</span></h2>
        </div>
        <div onClick={clickClose} className="close">
          <span className="material-symbols-outlined">close</span>
        </div>
      </div>
      <div className="sidebar">
        <a className={pName.length > 20 ? 'active' : ''} href={`${bUrl}`}>
          <span className="material-symbols-outlined">dashboard</span><h3>Dashboard</h3>
        </a>
        <a className={pName === 'setup' ? 'active' : ''} href={`${bUrl}/setup`}>
          <span className="material-symbols-outlined">manufacturing</span><h3>Setup Page</h3>
        </a>
      </div>
    </aside>
  );
};

export default RestaurantMenu;
