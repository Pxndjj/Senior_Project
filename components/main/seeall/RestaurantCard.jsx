"use client";
import { Card, CardHeader, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const renderStars = (rating) => {
    const fullStars = Math.floor(rating); 
    const hasHalfStar = rating - fullStars >= 0.3 && rating - fullStars <= 0.7; 
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); 

    return (
        <div className="flex">
            {/* ดาวเต็ม */}
            {[...Array(fullStars)].map((_, index) => (
                <span key={index} className="text-xl mr-1 text-yellow-400">
                    &#9733;
                </span>
            ))}
            {/* ดาวครึ่ง */}
            {hasHalfStar && (
                <span className="text-xl mr-1 text-yellow-400">
                    &#9734; 
                </span>
            )}
            {/* ดาวเปล่า */}
            {[...Array(emptyStars)].map((_, index) => (
                <span key={index} className="text-xl mr-1 text-gray-300">
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
            const matchesDay = selectedDayValue === "All Days" || (dayInfo && dayInfo.open.toLowerCase() === "on");
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
                {filteredRestaurants.filter((o) => o.status === "active").map((restaurant) => ( // แก้ไข inactive
                    <div
                        key={restaurant._id}
                        className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleCardClick(restaurant._id)}
                    >
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                            <p className="text-sm text-gray-500">{restaurant.address}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-yellow-500 mr-1">★</span>
                                <span className="text-sm">{restaurant.averageRating}</span>
                                <span className="text-sm text-gray-500 ml-2">({restaurant.reviews.length} reviews)</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">{restaurant.notes}</p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRestaurants.filter((o) => o.status === "active").length === 0 && (
                <div className="text-center text-gray-500 mt-4 text-5xl p-[15rem]">NO DATA</div>
            )}
        </div>
    );
};

export default RestaurantCard;
