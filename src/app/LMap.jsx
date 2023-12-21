// components/GoogleMap.js
"use client";
import React, { createContext, useState, useCallback, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const treasureLocations = [
  { name: "treasure-1", lat: 52.920724, lng: -1.03536 },
  { name: "treasure-2", lat: 52.920957, lng: -1.031999 },
  { name: "treasure-3", lat: 52.920776, lng: -1.033433 },
  { name: "home", lat: 52.921444, lng: -1.034414 },
];

const GoogleMapComponent = () => {
  // the default location will be the Northcoders base in Manchester
  const [userLocation, setUserLocation] = useState({
    lat: 53.47375,
    lng: -2.24026,
  });
  const [isInRange, setIsInRange] = useState(false);
  const [collected, setCollected] = useState(false);

  // if the user scans and they are within the circle, a collect button appears

  const handleScan = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        const userLatLng = { lat: userLatitude, lng: userLongitude };
        setUserLocation(userLatLng);
        const distances = treasureLocations.map((treasure) => {
          return window.google.maps.geometry.spherical.computeDistanceBetween(
            userLatLng,
            { lat: treasure.lat, lng: treasure.lng }
          );
        });

        distances.forEach((distance) => {
          if (distance <= 20) {
            setIsInRange(true);
          } else {
            setIsInRange(false);
          }
        });
        return distances;
      });
      (error) => {
        console.error("Error getting location");
      };
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);


  const handleCollect = () => {
    setCollected(true);
  };


  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
        onClick={handleScan}
      >
        Scan!
      </button>
      <button
        className={`${
          isInRange ? "block" : "hidden"
        } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full`}
        onClick={handleCollect}
      >
        Grab Treasure!
      </button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={17}
      >
        <Marker position={userLocation} />
        <ul>
          {treasureLocations.map((treasure) => {
            return (
              <li key={treasure.lat} className={collected ? "hidden" : null}>
                {!collected && (
                  <>
                    <Marker position={treasure} />
                    <Circle
                      center={treasure}
                      radius={20}
                      options={{
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#FF0000",
                        fillOpacity: 0.35,
                      }}
                    />
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
