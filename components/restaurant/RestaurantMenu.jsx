"use client";
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react"
const RestaurantMenu = () => {
  const params = useParams();
  const pathName = usePathname();
  const pName = pathName.split("/").pop();
  const bUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${params ? params.id : ""}`;

  return (
    <aside>
      <div className="toggle">
        <div className="logo">
          <img src="/J.png" />
          <h2><span className="danger">Joyfulwait</span></h2>
        </div>
      </div>
      <div className="sidebar">
        <a className={pName.length > 20 ? 'active' : ''} href={`${bUrl}`}>
          <span className="material-symbols-outlined">dashboard</span><h3>Dashboard</h3>
        </a>
        <a className={pName === 'queue' ? 'active' : ''} href={`${bUrl}/queue`}>
          <span className="material-symbols-outlined">add_circle</span><h3>Queue</h3>
        </a>                         
        <a className={pName === 'setup' ? 'active' : ''} href={`${bUrl}/setup`}>
          <span className="material-symbols-outlined">manufacturing</span><h3>Setting Page</h3>
        </a>
        <a className={pName === 'photos' ? 'active' : ''} href={`${bUrl}/photos`}>
          <span className="material-symbols-outlined">gallery_thumbnail</span><h3>Gallery</h3>
        </a>
        <a className='cursor-pointer' href={`/`}>
        <span className="material-symbols-outlined">storefront</span><h3>Restaurants</h3>
        </a>
        <a className='cursor-pointer' onClick={() => signOut()}>
          <span className="material-symbols-outlined">logout</span><h3>Logout</h3>
        </a>
      </div>
    </aside>
  );
};

export default RestaurantMenu;
