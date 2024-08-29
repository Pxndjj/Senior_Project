import React from 'react';
import RestaurantCard from '@/components/main/seeall/RestaurantCard';

const fetchRestaurants = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json();

    const restaurants = await Promise.all(data.map(async (restaurant) => {
      try {
        const resModels = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/review/all/${restaurant.refID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const reviews = await resModels.json();

        // คำนวณค่าเฉลี่ยของ rating
        const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

        return {
          ...restaurant,
          reviews, // เพิ่มรีวิวเข้าไปใน object ของ restaurant
          averageRating: averageRating.toFixed(1), // เพิ่มค่าเฉลี่ยของ rating
          image: `${process.env.NEXT_PUBLIC_BACKEND}/storage/image/${restaurant._id + restaurant.logo}`,
          position: [restaurant.latitude, restaurant.longitude],
          text: restaurant.name,
        };
      } catch (error) {
        console.error(`Error fetching reviews for restaurant ${restaurant.name}:`, error);
        return {
          ...restaurant,
          reviews: [],
          averageRating: 0,
          image: `${process.env.NEXT_PUBLIC_BACKEND}/storage/image/${restaurant._id + restaurant.logo}`,
          position: [restaurant.latitude, restaurant.longitude],
          text: restaurant.name,
        };
      }
    }));

    return restaurants;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default async function Page() {
  const restaurants = await fetchRestaurants();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 ml-6">{restaurants.length} restaurants available</h2>

      <RestaurantCard restaurant={restaurants} />
    </div>
  );
}