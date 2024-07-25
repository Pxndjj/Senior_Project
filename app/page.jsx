"use client"
import HeaderSection from '@/components/main/HeaderSection';
import RestaurantList from '@/components/main/RestaurantList';

export const revalidate = 60;

const fetchRestaurants = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json();
    return data.map(restaurant => ({
      ...restaurant,
      image: `${process.env.NEXT_PUBLIC_BACKEND}/storage/image/${restaurant._id + restaurant.logo}`,
      position: [restaurant.latitude, restaurant.longitude],
      text: restaurant.name
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default async function Page() {
  const restaurants = await fetchRestaurants();

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeaderSection />
      <div className="container mx-auto py-12 px-6">
        <div className="mb-2">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 relative inline-block">
            <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"></span>
            <span className="relative">Restaurant Near Me</span>
          </h2>
          <p className="text-base md:text-base text-gray-600 mx-auto">
            Discover nearby restaurants offering a variety of cuisines. Enjoy delicious meals without traveling far! Find your next favorite spot and book a table with just a click.
          </p>
        </div>

        <RestaurantList restaurants={restaurants} />
      </div>
    </div>
  );
}
