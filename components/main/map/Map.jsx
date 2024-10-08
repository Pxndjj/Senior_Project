import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRouter } from 'next/navigation';

// Custom icon for restaurants
const restaurantIcon = L.icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Custom icon for user's current location
const userLocationIcon = L.icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Function to calculate the distance between two points using Haversine formula
function getDistanceFromInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLon / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function Map({ restaurants }) {
  const [currentPosition, setCurrentPosition] = useState([18.7883, 98.9853]); // Default to Chiang Mai
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // For pagination
  const restaurantsPerPage = 5; // Max restaurants per page
  const router = useRouter();

  // Fetch user's current location and filter nearby restaurants
  useEffect(() => {
    console.log('Attempting to fetch current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current Position:', latitude, longitude);
        setCurrentPosition([latitude, longitude]);

        // Filter nearby restaurants within 10 km and that are "active"
        const filteredRestaurants = restaurants.filter((restaurant) => {
          const distance = getDistanceFromInKm(
            latitude, longitude,
            restaurant.position[0], restaurant.position[1]
          );
          return distance <= 10 && restaurant.status === "active"; // 10 km range and active status
        });

        setNearbyRestaurants(filteredRestaurants);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, [restaurants]);

  // Function to open restaurant detail page
  const handleRestaurantClick = (id) => {
    router.push(`/detail_restaurant/${id}`);
  };

  // Function to handle next click
  const handleNextClick = () => {
    if (currentIndex + restaurantsPerPage < nearbyRestaurants.length) {
      setCurrentIndex(currentIndex + restaurantsPerPage);
    }
  };

  // Function to handle previous click
  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - restaurantsPerPage);
    }
  };

  return (
    <div className="relative">
      {/* Map section */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <MapContainer center={currentPosition} zoom={13} className="w-full h-80">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Marker for user's current position */}
          <Marker position={currentPosition} icon={userLocationIcon}>
            <Popup>Your Current Location</Popup>
          </Marker>

          {/* Marker for nearby restaurants */}
          {nearbyRestaurants.map((restaurant, index) => (
            <Marker key={index} position={restaurant.position} icon={restaurantIcon}>
              <Popup>{restaurant.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Display the list of nearby restaurants */}
      <div className="restaurant-list mt-4">
        {nearbyRestaurants.length > 0 ? (
          <div className="flex items-center justify-center relative">
            {/* Left arrow */}
            {currentIndex > 0 && (
              <button
                className="absolute left-0 z-10 text-gray-700 py-2 px-4 rounded-full text-2xl font-bold hover:bg-gray-200"
                onClick={handlePrevClick}
              >
                &#60;
              </button>
            )}

            {/* Display 5 restaurants per page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center">
              {nearbyRestaurants
                .slice(currentIndex, currentIndex + restaurantsPerPage)
                .map((restaurant, index) => (
                  <div
                    key={index}
                    className="card border rounded-lg p-4 mb-2 shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => handleRestaurantClick(restaurant._id)}
                    style={{ width: '250px', height: '350px' }} // Enlarged card size
                  >
                    <img
                      src={restaurant.image || 'https://via.placeholder.com/150'}
                      alt={restaurant.name}
                      className="h-48 w-full object-cover rounded-lg"
                    />
                    <h3 className="font-bold text-lg mt-2">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm">{restaurant.address}</p>
                    <p className="text-sm">
                      Distance: {getDistanceFromInKm(
                        currentPosition[0], currentPosition[1],
                        restaurant.position[0], restaurant.position[1]
                      ).toFixed(2)} km
                    </p>
                  </div>
                ))}
            </div>

            {/* Right arrow */}
            {currentIndex + restaurantsPerPage < nearbyRestaurants.length && (
              <button
                className="absolute right-0 z-10 text-gray-700 py-2 px-4 rounded-full text-2xl font-bold hover:bg-gray-200"
                onClick={handleNextClick}
              >
                &#62;
              </button>
            )}
          </div>
        ) : (
          <p className='font-bold text-lg text-red-500 bg-red-100 border border-red-400 rounded-lg p-4 text-center mt-8'>
            No nearby restaurants within 10 km.
          </p>

        )}
      </div>
    </div>
  );
}

export default Map;
