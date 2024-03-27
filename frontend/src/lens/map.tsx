// @ts-nocheck
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface Location {
  coordinates: [number, number];
  memo: { memo: string; selectedCategories: string[] }[];
}

interface MapProps {
  locations: Location[];
}

const Map: React.FC<MapProps> = ({ locations }) => {
  return (
    <MapContainer
      center={[49.27326489299744, -123.10365200042726]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <Marker key={index} position={location.coordinates}>
          <Popup>
            {location.memo.map((memo, memoIndex) => (
              <div key={`${index}-${memoIndex}`}>
                <p>{memo.title}</p>
                <p>{memo.memo}</p>
                <p>{memo.selectedCategories}</p>
              </div>
            ))}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
