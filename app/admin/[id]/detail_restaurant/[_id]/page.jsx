'use client';
import React, { useState, useEffect } from 'react';
import RestaurantDetails from '@/components/admin/RestaurantDetail';

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
      data.image = `${process.env.NEXT_PUBLIC_BACKEND}/storage/image/${data._id + data.logo}`;
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return { recommendedMenu: [] }; // Return default structure
    }
  },
  fetchGallery: async (_id) => {
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
      return []; // Return empty array
    }
  },
};

export default function Page({ params }) {
  const { _id } = params;
  const [data, setData] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const restaurantData = await api.fetchData(_id);
      const galleryData = await api.fetchGallery(_id);
      restaurantData.recommendedMenu = galleryData;
      setData(restaurantData);
      setGallery(galleryData);
    };

    fetchData();
  }, [_id]);

  const refreshData = async () => {
    const restaurantData = await api.fetchData(_id);
    const galleryData = await api.fetchGallery(_id);
    restaurantData.recommendedMenu = galleryData;
    setData(restaurantData);
    setGallery(galleryData);
  };

  const finalData = data || { recommendedMenu: [] }; // Ensure finalData always has recommendedMenu

  console.log(finalData)
  return (
    <RestaurantDetails data={finalData} onRefresh={refreshData} />
  );
}
