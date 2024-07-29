"use client";
import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const RestaurantList = ({ restaurants }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/detail_restaurant/${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {restaurants.map((restaurant, index) => (
        <div key={index} className="relative group cursor-pointer" onClick={() => handleCardClick(restaurant._id)}>
          <Card className="h-full py-2 bg-white shadow-md rounded-md overflow-hidden transition-transform duration-300 transform group-hover:scale-105 group-hover:shadow-lg">
            <CardHeader className="pb-0 pt-1 px-2 h-48">
              <img
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                className="rounded-md"
                src={restaurant.image}
                alt={`Photo ${restaurant.logo}`}
              />
            </CardHeader>
            <CardBody className="h-14 overflow-hidden py-2 px-2 text-sm">
              <p className="text-xs font-bold truncate">{restaurant.name}</p>
              <small className="text-gray-500 truncate">{restaurant.address}</small>
            </CardBody>
          </Card>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
