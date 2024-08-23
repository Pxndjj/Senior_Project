'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ListFile from '@/components/admin/ListFile';
import Booking from '@/components/main/detail/Booking';
import GalleryDisplay from '@/components/restaurant/gallery/GalleryDisplay';
import ReviewList from './ReviewList';
import Review from './Review';

const RestaurantDetails = ({ data }) => {
    const router = useRouter();
    const recommendedMenu = Array.isArray(data.recommendedMenu) ? data.recommendedMenu : [];
    const carouselRef = useRef(null);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [reviews, setReviews] = useState(data.reviews || []);

    const [triggerReload, setTriggerReload] = useState(0);

    const handleReviewSubmit = (newReview) => {
        setTriggerReload(prev => prev + 1);
    };


    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -carouselRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: carouselRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleItemClick = (menuItem) => {
        setSelectedItem(menuItem);
        setShowDetail(true);
    };

    const handleCloseDialog = () => {
        setShowDetail(false);
        setSelectedItem(null);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="card-default">
                <div className="bg-white rounded-xl overflow-hidden flex flex-col lg:flex-row">
                    <div className="relative lg:w-2/3 flex-shrink-0">
                    <img
                            src={data.image}
                            alt="Restaurant Logo"
                            className="w-full h-full object-cover rounded-t-xl lg:rounded-tr-none lg:rounded-l-xl"
                            style={{ maxHeight: '300%', minHeight: '300px', aspectRatio: '16/9' }}
                        />
                    </div>

                    <div className="p-6 lg:w-1/3 flex flex-col">
                        <div className="text-center lg:text-left mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">{data.name}</h2>
                            <p className="text-sm text-gray-600 mt-1">{data.address}</p>
                            <p className="text-sm text-gray-600">Phone: {data.phone}</p>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Opening hours</h3>
                            <ul className="space-y-2 text-gray-700">
                                {Object.keys(data.openingHours).filter(o => o != "_id").map((day) => (
                                    <li key={day} className="flex justify-between text-sm">
                                        <span className="capitalize font-medium">{day}:</span>
                                        {data.openingHours[day].open == "off" ? <span>Out of service</span> : <span>{data.openingHours[day].start} - {data.openingHours[day].to}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Note</h3>
                            <p className="text-gray-700">{data.notes}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Condition</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {data.conditions.map((condition, index) => (
                                    <li key={index} className="text-sm">{condition}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-auto flex">
                            <Booking restaurantID={data._id} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-default mt-[20px]">
                <ReviewList dataRestaurant={data} reviews={reviews} triggerReload={triggerReload} />
                <Review dataRestaurant={data} onReviewSubmit={handleReviewSubmit} />
            </div>
            {recommendedMenu.length !== 0 ? (
                <div className="card-default mt-[20px]">

                    <>
                        <h5 className="text-2xl font-semibold mb-6 text-gray-900">{recommendedMenu.length} Photos</h5>
                        <div className="relative flex items-center justify-center">
                            <button
                                onClick={scrollLeft}
                                className="absolute left-0 z-10 bg-white text-gray-700 p-2 rounded-full focus:outline-none shadow-md hover:bg-gray-100 transition duration-200"
                                style={{ transform: 'translateX(-50%)', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                ←
                            </button>
                            <div
                                ref={carouselRef}
                                className="flex space-x-4 overflow-hidden p-4 bg-gradient-to-r from-gray-50 to-gray-100 mx-5 rounded-lg border-gray-200 scrollbar-hidden"
                                style={{ maxWidth: 'calc(100% - 80px)', scrollSnapType: 'x mandatory' }}
                            >
                                {recommendedMenu.map((menuItem, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105"
                                        style={{ scrollSnapAlign: 'start' }}
                                    >
                                        <div className="p-4">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_BACKEND}/gallery/preview/${menuItem.fileName}`}
                                                onClick={() => handleItemClick(menuItem)}
                                                alt={menuItem.name || 'Menu Item'}
                                                className="w-full h-48 object-cover cursor-pointer rounded-t-lg"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={scrollRight}
                                className="absolute right-0 z-10 bg-white text-gray-700 p-2 rounded-full focus:outline-none shadow-md hover:bg-gray-100 transition duration-200"
                                style={{ transform: 'translateX(50%)', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                →
                            </button>
                        </div>
                    </>

                </div>
            ) : ""}
            {showDetail && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center z-[50] bg-black bg-opacity-90" onClick={handleCloseDialog}>
                    <GalleryDisplay isOpen={showDetail} onClose={handleCloseDialog} item={selectedItem} />
                </div>
            )}
        </div>
    );
};

export default RestaurantDetails;
