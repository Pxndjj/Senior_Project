import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = L.icon({
    iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

function Map({ restaurants }) {
    const [currentPosition, setCurrentPosition] = useState([18.7883, 98.9853]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition([latitude, longitude]);
            },
            (error) => {
                console.error('Error getting user location:', error);
            }
        );
    }, []);

    return (
        <div className="border border-gray-100 rounded-lg overflow-hidden"> {/* Wrapper div with border */}
            <MapContainer center={currentPosition} zoom={13} className="w-full h-80">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {restaurants.map((restaurant, index) => (
                    <Marker key={index} position={restaurant.position} icon={customIcon}>
                        <Popup>{restaurant.text}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default Map;
