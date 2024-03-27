 // @ts-nocheck
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '/images/marker-icon.png';
const MapForm = ({ selectedLocation, onMapClick }: any) => {
  const [initialPosition, setInitialPosition] = useState([49.27326489299744, -123.10365200042726]);

  const [positions, setPositions] = useState([initialPosition]);
  const customMarkerIcon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [32, 32], // Adjust the size of your marker icon as needed
  });
  useEffect(() => {
    if (selectedLocation) {
      console.log(selectedLocation);
      console.log(positions);
      // Add a new position for the selected location
      setPositions([...positions, selectedLocation]);
      setInitialPosition(selectedLocation);
      addMarkerAndNavigate(selectedLocation);

    }
  }, [selectedLocation]);

  const addMarkerAndNavigate = (location: any) => {
    setPositions([location]); // Set the positions array with only the new location
    onMapClick(location); // Trigger the map click event
    setInitialPosition(location);
  };

  const Markers = () => {
    const map = useMapEvents({
      click(e) {
        const clickedLocation = [e.latlng.lat, e.latlng.lng];
        setPositions([...positions, clickedLocation]); // Add new position to the array
        onMapClick(clickedLocation);
        setInitialPosition(clickedLocation);
      },
    });

    const deleteMarker = (index: any, e: any) => {
      e.stopPropagation(); // Stop event propagation to prevent the map click event
      const updatedPositions = [...positions];
      updatedPositions.splice(index, 1); // Remove the position at the specified index
      setPositions(updatedPositions);
    };

    return positions.map((position, index) => (
      <Marker key={index} position={position} icon={customMarkerIcon} draggable={true} eventHandlers={{
        dragend: (e: any) => {
          const updatedPositions = [...positions];
          updatedPositions[index] = [e.target.getLatLng().lat, e.target.getLatLng().lng]; // Update the position at the specified index
          setPositions(updatedPositions);
          onMapClick([e.target.getLatLng().lat, e.target.getLatLng().lng]);
          setInitialPosition([e.target.getLatLng().lat, e.target.getLatLng().lng]);
        }
      }}>
        <Popup>
          <button onClick={(e) => deleteMarker(index, e)}>Delete</button> {/* Button to delete the marker */}
        </Popup>
      </Marker>
    ));
  };

  return (
    <MapContainer
      key={initialPosition.toString()}
      center={initialPosition}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <Markers />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default MapForm;
