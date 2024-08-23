import HeaderSection from '@/components/main/HeaderSection';
import RestaurantList from '@/components/main/RestaurantList';
import dynamic from 'next/dynamic';

const DynamicMapClient = dynamic(() => import('@/components/main/map/DynamicMapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[40vh]">
      <div className="text-center">
        <div className="relative inline-block">
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-12 w-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
            </svg>
          </span>
          <span className="relative text-2xl font-bold text-gray-800">Load...</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment...</p>
      </div>
    </div>
  )
});

export const revalidate = 60;

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

        <DynamicMapClient restaurants={restaurants} />
        <RestaurantList restaurants={restaurants} />
      </div>
    </div>
  );
}
