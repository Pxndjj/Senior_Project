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
          <h2><span className="danger">RS</span></h2>
        </div>
        <div onClick={clickClose} className="close">
          <span className="material-symbols-outlined">close</span>
        </div>
      </div>
      <div className="sidebar">
        <a className={pName.length > 20 ? 'active' : ''} href={`${bUrl}`}>
          <span className="material-symbols-outlined">dashboard</span><h3>Dashboard</h3>
        </a>
        <a className={pName === 'queue' ? 'active' : ''} href={`${bUrl}/queue`}>
          <span className="material-symbols-outlined">thumbs_up_down</span><h3>Queue</h3>
        </a>
        {/* <a className={pName === 'promotion' ? 'active' : ''} href={`${bUrl}/promotion`}>
          <span className="material-symbols-outlined">verified</span><h3>Promotion</h3>
        </a>
        <a className={pName === 'promote' ? 'active' : ''} href={`${bUrl}/promotion`}>
        <span className="material-symbols-outlined">trophy</span><h3>Promote Brand</h3>
        </a>  
        <a className={pName === 'recommended' ? 'active' : ''} href={`${bUrl}/recommended`}>
        <span className="material-symbols-outlined">thumb_up</span><h3>Recommended</h3>
        </a>                           */}
        <a className={pName === 'setup' ? 'active' : ''} href={`${bUrl}/setup`}>
          <span className="material-symbols-outlined">manufacturing</span><h3>Setting Page</h3>
        </a>
        {/* <a className={pName === 'photos' ? 'active' : ''} href={`${bUrl}/photos`}>
          <span className="material-symbols-outlined">gallery_thumbnail</span><h3>Gallery</h3>
        </a>
        <a className={pName === 'bill' ? 'active' : ''} href={`${bUrl}/bill`}>
          <span className="material-symbols-outlined">toggle_on</span><h3>bill</h3>
        </a> */}
      </div>
    </aside>
  );
};

export default RestaurantMenu;
