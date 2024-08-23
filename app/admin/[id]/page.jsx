"use client";

import React, { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button, Pagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const api = {
  getRestaurant: async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/restaurant/all`;
    const response = await fetch(apiUrl);
    const result = await response.json();
    return result;
  },
  countRestaurant: async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/restaurant/count`;
    const response = await fetch(apiUrl);
    const result = await response.json();
    return result;
  },
  countUser: async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/count`;
    const response = await fetch(apiUrl);
    const result = await response.json();
    return result;
  },
};

const dayNames = {
  sunday: "อาทิตย์",
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
};

const Admin = ({ params }) => {
  const [restaurant, setRestaurant] = useState([]);
  const [countUser, SetCountUser] = useState(0);
  const [countRestaurant, SetCountRestaurant] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage] = useState(8);

  useEffect(() => {
    (async () => {
      let _restaurant = await api.getRestaurant();
      let countRestaurant = await api.countRestaurant();
      let countUser = await api.countUser();

      _restaurant.sort((a, b) => {
        if (a.status === 'inactive' && b.status === 'active') return -1;
        if (a.status === 'active' && b.status === 'inactive') return 1;
        return 0;
      });

      setRestaurant(_restaurant);
      SetCountUser(countUser);
      SetCountRestaurant(countRestaurant);
    })();
  }, []);

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = restaurant.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getCurrentOpeningHours = (openingHours) => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = new Date().getDay();
    const currentDay = days[today];
    const thaiDay = dayNames[currentDay];
    return { day: thaiDay, hours: openingHours[currentDay] };
  };

  const router = useRouter();
  const handleCardClick = (_id) => {
    router.push(`/admin/${params.id}/detail_restaurant/${_id}`);
  };

  return (
    <div className="w-[100rem]">
      <main className="main-content">
        <div className="queue-list">
          <div className="flex justify-between ">
            <h2>Confirm Restaurant</h2>
            <div className="text-right"></div>
          </div>
          <div className="card-table">
            <table>
              <thead>
                <tr>
                  <th className="name w-2/12">Restaurant Name</th>
                  <th className="w-1/12">Location</th>
                  <th className="w-1/12">Date open</th>
                  <th className="w-1/12">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentRestaurants.map((item) => {
                  const currentHours = getCurrentOpeningHours(item.openingHours);
                  return (
                    <tr key={item._id} className="h-20 cursor-pointer hover:scale-95 transition-all" onClick={() => handleCardClick(item._id)}>
                      <td>
                        <div className="flex gap-4 items-center flex-1 w-full h-full">
                          <span className="material-symbols-outlined">storefront</span>
                          <div>{item.name}</div>
                        </div>
                      </td>
                      <td>{item.address}</td>
                      <td>
                        <div>
                          <Popover placement="bottom" showArrow={true}>
                            <PopoverTrigger>
                              <Button color="foreground">
                                {
                                  currentHours.hours.open === "off"
                                    ? "Out Of Service"
                                    : `Open ${currentHours.hours.start} ${currentHours.day}.`
                                }
                                <div className="text-[10px] align-text-top font-bold">&#8595;</div>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="px-1 py-2">
                                {Object.entries(item.openingHours).slice(0, -1).map(([day, hours]) => (
                                  <div className="flex justify-between" key={day}>
                                    <div className="w-24 capitalize">{day}</div>
                                    {item.openingHours[day].open == "off" ? <span>Out Of Service</span> : <span>{hours.start} - {hours.to}</span>}
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <div className={`${(item.status === "active" && "bg-[#00B69B]") || (item.status === "waiting" && "bg-[#FD5454]") || (item.status === "inactive" && "bg-[#FCBE2D]")} text-white rounded-full py-1 w-[80%]`}>
                            {item.status}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              total={Math.ceil(restaurant.length / restaurantsPerPage)}
              page={currentPage}
              onChange={paginate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
