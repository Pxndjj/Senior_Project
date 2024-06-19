"use server"
import GalleryList from "@/components/restaurant/gallery/GalleryList";
import GalleryUpload from "@/components/restaurant/gallery/GalleryUpload";

//apis
const api = {
  fetchGallery:async(refID)=>{
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/gallery/getbyrefid/${refID}`, {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      const dataJson = await res.json();
      return dataJson;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  fetchRestaurant:async(refID)=>{
    try {
      const respons = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/get?id=${refID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      const dataJson = await respons.json();
      return dataJson;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
//server rendor
export default async function RsPhotos({params}) {
const userID = String(params.id);
const intRestaurant = await api.fetchRestaurant(userID);
const refID = intRestaurant?intRestaurant._id:0;
let iniGallery = await api.fetchGallery(refID);
let photoTotal = iniGallery?Number(iniGallery.length):0;
  return (
    <main className="main-content mt-1">
      <div className="flex justify-between pb-5">
      <h2 className="menu-title">Restaurant/Gallery</h2>
          <GalleryUpload params={refID} totalPhoto={photoTotal}/>
      </div>
          <GalleryList dataGallery={iniGallery}/>
    </main>
  );
}


