"use client";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const RestaurantList = ({ restaurants }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/detail_restaurant/${id}`);
  };

  const handleSeeallClick = () => {
    router.push(`/all_restaurant`);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-xl mr-1 ${index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
              }`}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 relative">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-800 relative">
            Popular Restaurants
            <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"></span>
          </h2>
          <p className="text-gray-500 mt-2">
            Discover top-rated dining spots near you
          </p>
        </div>
        <button
          onClick={handleSeeallClick}
          className="flex items-center mt-4 sm:mt-0 px-4 py-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-300"
        >
          See all
          <span className="ml-1">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {restaurants
          .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating))
          .slice(0, 10) // Showing top 10 restaurants by rating
          .map((restaurant, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => handleCardClick(restaurant._id)}
            >
              <Card className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-lg h-full flex flex-col justify-between">
                <CardHeader className="p-0">
                  <img
                    style={{ height: "180px", width: "100%", objectFit: "cover" }}
                    className="rounded-t-lg"
                    src={restaurant.image}
                    alt={`Photo of ${restaurant.name}`}
                  />
                </CardHeader>
                <CardBody className="flex-grow py-4 px-4 flex flex-col justify-between">
                  <p className="text-lg font-semibold text-gray-800 line-clamp-2" style={{ minHeight: '48px' }}>
                    {restaurant.name}
                  </p>

                  <div className="flex items-center mt-2" style={{ minHeight: '32px' }}>
                    {renderStars(restaurant.averageRating)}
                    <span className="ml-2 text-sm text-gray-500">
                      ({restaurant.averageRating})
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs mt-1 line-clamp-2" style={{ minHeight: '40px' }}>
                    {restaurant.address}
                  </p>
                </CardBody>
              </Card>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-black"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RestaurantList;
