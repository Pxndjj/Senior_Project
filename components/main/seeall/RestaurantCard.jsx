"use client";
import { Card, CardHeader, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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

const RestaurantCard = ({ restaurant }) => {
    const router = useRouter();

    const handleCardClick = (id) => {
        router.push(`/detail_restaurant/${id}`);
    };

    const [selectedKeys, setSelectedKeys] = useState(new Set(["ALL"]));
    const [selectedDay, setSelectedDay] = useState(new Set(["All Days"]));
    const [searchTerm, setSearchTerm] = useState("");

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const selectedDayValue = useMemo(
        () => Array.from(selectedDay).join(", "),
        [selectedDay]
    );


    const filteredRestaurants = useMemo(() => {
        return restaurant.filter((restaurant) => {
            const matchesName = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
            const dayInfo = restaurant.openingHours[selectedDayValue.toLowerCase()];
            const matchesDay =
                selectedDayValue === "All Days" || (dayInfo && dayInfo.open.toLowerCase() === "on");
            const matchesRating = selectedValue === "ALL" || Number(restaurant.averageRating) == Number(selectedValue);
            return matchesName && matchesDay && matchesRating;
        });
    }, [restaurant, searchTerm, selectedDayValue, selectedValue]);

    return (
        <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-[40rem]">
                    <Input
                        type="text"
                        label="Search the name of restaurant"
                        className="flex-1"
                        size={"sm"}
                        variant={"faded"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" className="capitalize w-[10rem]">
                            {selectedValue === "ALL" ? "Rating" : renderStars(Number(selectedValue))}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Star selection"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                    >
                        <DropdownItem key="ALL">Rating</DropdownItem>
                        <DropdownItem key="1">{renderStars(1)}</DropdownItem>
                        <DropdownItem key="2">{renderStars(2)}</DropdownItem>
                        <DropdownItem key="3">{renderStars(3)}</DropdownItem>
                        <DropdownItem key="4">{renderStars(4)}</DropdownItem>
                        <DropdownItem key="5">{renderStars(5)}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" className="capitalize w-[10rem]">{selectedDayValue}</Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Select Day"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedDay}
                        onSelectionChange={setSelectedDay}
                    >
                        {/* ตัวเลือกวันในสัปดาห์ */}
                        <DropdownItem key="All Days">All Days</DropdownItem>
                        <DropdownItem key="Monday">Monday</DropdownItem>
                        <DropdownItem key="Tuesday">Tuesday</DropdownItem>
                        <DropdownItem key="Wednesday">Wednesday</DropdownItem>
                        <DropdownItem key="Thursday">Thursday</DropdownItem>
                        <DropdownItem key="Friday">Friday</DropdownItem>
                        <DropdownItem key="Saturday">Saturday</DropdownItem>
                        <DropdownItem key="Sunday">Sunday</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => {
                    // ฟังก์ชันสำหรับตัดคำอธิบายที่ยาวเกินไป
                    const truncateText = (text, maxLength) => {
                        if (text.length > maxLength) {
                            return text.slice(0, maxLength) + '...';
                        }
                        return text;
                    };

                    return (
                        <div
                            key={restaurant._id}
                            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col h-full"
                            onClick={() => handleCardClick(restaurant._id)}
                            style={{ width: '100%' }} // กำหนดให้ card มีความกว้างเท่ากัน
                        >
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="flex-grow py-4 px-4 flex flex-col justify-between">
                                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                <p className="text-sm text-gray-500">{restaurant.address}</p>

                                {/* จัดให้การแสดงผลดาวอยู่ที่ตำแหน่งเดียวกันในทุก card */}
                                <div className="mt-2 flex-grow flex items-end">
                                    <div className="flex items-center">
                                        {renderStars(restaurant.averageRating)}
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({restaurant.averageRating})
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">({restaurant.reviews.length} reviews)</span>
                                    </div>
                                </div>

                                {/* ใช้ truncateText สำหรับตัดคำอธิบาย */}
                                <p className="text-sm text-gray-500 mt-2">
                                    {truncateText(restaurant.notes, 100)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );

};

export default RestaurantCard;
