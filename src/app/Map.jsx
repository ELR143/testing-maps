'use client'
import {
    What3wordsAutosuggest,
    What3wordsMap
  } from "@what3words/react-components";
import { whatThreeWordsKey, googleKey } from './keys'
  
  const API_KEY = whatThreeWordsKey;
  const MAP_API_KEY = googleKey;
  
  export default function Map() {
    return (
      <What3wordsMap
        id="w3w-map"
        api_key={API_KEY}
        map_api_key={MAP_API_KEY}
        disable_default_ui={true}
        fullscreen_control={true}
        map_type_control={true}
        zoom_control={true}
        current_location_control_position={9}
        fullscreen_control_position={3}
        search_control_position={2}
        words="filled.count.soap"
      >
        <div slot="map" style={{ width: "100vw", height: "100vh" }} />
        <div slot="search-control" style={{ margin: "10px 0 0 10px" }} >
          <What3wordsAutosuggest>
            <input
              type="text"
              placeholder="Find your address"
              style={{ width: "300px" }}
              autoComplete="off"
            />
          </What3wordsAutosuggest>
        </div>
        <div slot="current-location-control" style={{ margin: "0 10px 10px 0"}}>
          <button>Current Location</button>
        </div>
      </What3wordsMap>
    );
  }