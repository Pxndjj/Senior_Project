'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Booking from '@/components/main/detail/Booking';
import GalleryDisplay from '@/components/restaurant/gallery/GalleryDisplay';

const backgroundStyle = (path) => {
    return {
        backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND}/gallery/preview/${path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '250px',
        width: '100%',
    }
}

const RestaurantDetails = ({ data }) => {
    const router = useRouter();
    const recommendedMenu = Array.isArray(data.recommendedMenu) ? data.recommendedMenu : [];

    const carouselRef = useRef(null);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const [showDetail, setShowDetail] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (menuItem) => {
        setSelectedItem(menuItem);
        setShowDetail(true);
    };

    const handleCloseDialog = () => {
        setShowDetail(false);
        setSelectedItem(null);
    };

    return (
        <div className="container mx-auto p-6 lg:p-12">
            <div className="bg-white shadow-md rounded-xl border border-gray-300 overflow-hidden flex flex-col lg:flex-row">
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
                        <p className="text-sm text-gray-600">phone: {data.phone}</p>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-3 text-gray-900">Open hour</h3>
                        <ul className="space-y-2 text-gray-700">
                            {Object.keys(data.openingHours).filter(o => o != "_id").map((day) => (
                                <li key={day} className="flex justify-between text-sm">
                                    <span className="capitalize font-medium">{day}:</span>
                                    <span>{data.openingHours[day].start} - {data.openingHours[day].to}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-3 text-gray-900">Note</h3>
                        <p className="text-gray-700">{data.notes}</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-3 text-gray-900">Conditions</h3>
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

            <div className="mt-12">
                {recommendedMenu.length > 0 && (
                    <>
                        <h3 className="text-3xl font-semibold mb-6 text-gray-900">{recommendedMenu.length} Photos</h3>
                        <div className="flex items-center">
                            <button onClick={scrollLeft} className="bg-gray-800 text-white p-2 rounded-full focus:outline-none mr-4">←</button>
                            <div ref={carouselRef} className="flex space-x-6 overflow-x-scroll scrollbar-hide" style={{ maxWidth: 'calc(100% - 64px)' }}>
                                {recommendedMenu.map((menuItem, index) => (
                                    <div key={index} className="flex-shrink-0 w-64 bg-white shadow-md rounded-lg border border-gray-300 overflow-hidden">
                                        <img src={`${process.env.NEXT_PUBLIC_BACKEND}/gallery/preview/${menuItem.fileName}`} onClick={() => handleItemClick(menuItem)} alt='123' className="w-full h-48 object-cover cursor-pointer" />
                                    </div>
                                ))}
                            </div>
                            <button onClick={scrollRight} className="bg-gray-800 text-white p-2 rounded-full focus:outline-none ml-4">→</button>
                        </div>
                    </>
                )}
            </div>

            {showDetail && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center z-[50] bg-black bg-opacity-90" onClick={handleCloseDialog}>
                    <GalleryDisplay isOpen={showDetail} onClose={handleCloseDialog} item={selectedItem} />
                </div>
            )}

        </div>
    );
};

export default RestaurantDetails;
