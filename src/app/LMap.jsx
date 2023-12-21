// components/GoogleMap.js
"use client";
import React, { createContext, useState, useCallback, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const treasureLocations = [
    { id: 1, lat: 52.920724, lng: -1.03536 },
    { id: 2, lat: 52.920957, lng: -1.031999 },
    { id: 3, lat: 52.920776, lng: -1.033433 },
    { id: 4, lat: 52.921444, lng: -1.034414 },
  ];
  
  const GoogleMapComponent = () => {
    const [userLocation, setUserLocation] = useState({
      lat: 53.47375,
      lng: -2.24026,
    });
    const [isInRange, setIsInRange] = useState(false);
    const [collectedTreasures, setCollectedTreasures] = useState({});
  
    const handleScan = useCallback(() => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition((position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          const userLatLng = { lat: userLatitude, lng: userLongitude };
          setUserLocation(userLatLng);
  
          const updatedCollectedTreasures = { ...collectedTreasures };
  
          treasureLocations.forEach((treasure) => {
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
              userLatLng,
              { lat: treasure.lat, lng: treasure.lng }
            );
  
            if (distance <= 20) {
              setIsInRange(true);
              updatedCollectedTreasures[treasure.id] = true;
            } else {
              setIsInRange(false);
              updatedCollectedTreasures[treasure.id] = false;
            }
          });
  
          setCollectedTreasures(updatedCollectedTreasures);
        }, (error) => {
          console.error("Error getting location");
        });
  
        // Clear the watch when the component is unmounted or no longer needed
        return () => navigator.geolocation.clearWatch(watchId);
      }
    }, [collectedTreasures]);
  
    const handleCollect = (treasureId) => {
      setCollectedTreasures((prevCollectedTreasures) => ({
        ...prevCollectedTreasures,
        [treasureId]: true,
      }));
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
          onClick={() => handleCollect("treasure-1")} // Specify the treasure id you want to collect
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
            {treasureLocations.map((treasure) => (
              <li key={treasure.id} className={collectedTreasures[treasure.id] ? "hidden" : null}>
                {!collectedTreasures[treasure.id] && (
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
            ))}
          </ul>
        </GoogleMap>
      </LoadScript>
    );
  };
  
  export default GoogleMapComponent;
