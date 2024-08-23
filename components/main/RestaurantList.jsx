"use client";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for routing

const RestaurantList = ({ restaurants }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/detail_restaurant/${id}`);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-xl mr-1 ${index < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {restaurants.filter(o => o.status === "active").map((restaurant, index) => (
        <div key={index} className="relative group cursor-pointer" onClick={() => handleCardClick(restaurant._id)}>
          <Card className="h-full py-2 bg-white shadow-md rounded-md overflow-hidden transition-transform duration-300 transform group-hover:scale-105 group-hover:shadow-lg">
            <CardHeader className="pb-0 pt-1 px-2 h-48">
              <img
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
                className="rounded-md"
                src={restaurant.image}
                alt={`Photo ${restaurant.logo}`}
              />
            </CardHeader>
            <CardBody className="overflow-visible py-2 px-2 text-sm">
              <p className="text-xs font-bold truncate">{restaurant.name}</p>
              <small className="text-gray-500">{renderStars(restaurant.averageRating)}</small>
              <small className="text-gray-500">{restaurant.address}</small>
            </CardBody>
          </Card>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
