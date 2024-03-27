// @ts-nocheck
import React, { useState, useEffect } from 'react';

const SavedLocations = ({ id, reloadDropdown, onDropdownReloaded, onLocationSelected }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const fetchSavedLocations = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`);
        const data = await response.json();
        console.log('Fetched saveLoc:', data.saveLoc);
        setSavedLocations(data.saveLoc || []);
        onDropdownReloaded(); // Call the onDropdownReloaded function after the dropdown has been reloaded
      } catch (error) {
        console.error('Error fetching saved locations:', error);
      }
    };

    if (reloadDropdown) {
      fetchSavedLocations();
    }
  }, [id, reloadDropdown, onDropdownReloaded]);

  
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedLocation = savedLocations.find(location => location.name === selectedValue);

    if (selectedLocation) {
      const coordinates = selectedLocation.coordinates;
      setSelectedLocation(coordinates);
      // Pass the selected location coordinates to the parent component
      onLocationSelected(coordinates);
    }
  };

  return (
    <div>
      <label htmlFor="savedLocations">Saved Locations:</label>
      <select id="savedLocations" value={selectedLocation} onChange={handleSelectChange}>
        {savedLocations.map((location, index) => (
          <option key={index} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SavedLocations;
