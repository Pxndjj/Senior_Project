// app/page.js
import React from 'react';
import RestaurantDetails from '@/components/main/detail/RestaurantDetails';

const api = {
  fetchData: async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      // Correctly set the image URL
      data.image = `${process.env.NEXT_PUBLIC_BACKEND}/storage/image/${data._id + data.logo}`;
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  },
  fetchGallery: async (_id) => {
    console.log(_id)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/gallery/getbyrefid/${_id}`, {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  },
};

export default async function Page({ params }) {
  const { id } = params;
  const data = await api.fetchData(id);
  const dataGallery = await api.fetchGallery(id);

  data.recommendedMenu = dataGallery

  const finalData = data ;
  return (
    <RestaurantDetails data={finalData} restaurantID={id} />
  );
}
