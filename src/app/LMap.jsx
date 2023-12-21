// components/GoogleMap.js
"use client";
import React, { createContext, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { googleKey } from './keys'

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 53.47375,
  lng: -2.24026,
};

const treasureLocations = [
  {
    lat: 52.920724,
    lng: -1.03536,
  },
  {
    lat: 52.920957,
    lng: -1.031999,
  },
  {
    lat: 52.920776,
    lng: -1.033433,
  },
];

const GoogleMapComponent = () => {
  // the default location will be the Northcoders base in Manchester
  const [userLocation, setUserLocation] = useState({
    lat: 53.47375,
    lng: -2.24026,
  });

  // if the user scans and they are within the circle, a collect button appears

  const handleScan = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log(userLocation);
        },
        (error) => {
          console.error("Error getting location");
        }
      );
    }
  };


  useEffect(() => {}, []);

  return (
    <LoadScript googleMapsApiKey={googleKey}>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
        onClick={handleScan}
      >
        Scan!
      </button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={17}
      >
        <Marker position={center} />
        {treasureLocations.map((treasure) => {
          return (
            <>
              <Marker key={treasure.lat} position={treasure} />
              <Circle
                center={treasure}
                radius={10}
                options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                    visible: false,
                }}
              />
            </>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
