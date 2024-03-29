'use client'
import React, { useState, useEffect } from 'react';
import Map from './map';
import { Link } from 'react-router-dom';

interface Location {
  coordinates: [number, number];
  memo: { memo: string; selectedCategories: string[] }[];
}

const Lens: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [id, setID] = useState('');
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  
  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setID(idFromQuery);
      
      const response = await fetch(`http://localhost:3000/api/users/${idFromQuery}`);
      const data = await response.json();
      setUserData(data);
      fetchMemos(data.memos);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

  };

  const fetchMemos = async (memoID) => {
    try {
      const fetchedLocations: Location[] = [];
      for (const mid of memoID) {
        const response = await fetch(`http://localhost:3000/api/memos/${mid}`);
        const memoData = await response.json();
        
        const locationName = memoData.location.name;
        const coordinates = memoData.location.coordinates;
        const memo = { title: memoData.name, memo: memoData.description, selectedCategories: memoData.tags };
        
        // Check if location already exists in fetchedLocations array
        const existingLocationIndex = fetchedLocations.findIndex(loc => loc.coordinates[0] === coordinates[0] && loc.coordinates[1] === coordinates[1]);
        
        if (existingLocationIndex !== -1) {
          // Location already exists, add memo to its memo array
          fetchedLocations[existingLocationIndex].memo.push(memo);
        } else {
          // Location doesn't exist, create a new Location object
          fetchedLocations.push({ coordinates: coordinates, memo: [memo] });
        }
      }
      
      setLocations(fetchedLocations);
    } catch (error) {
      console.error('Error fetching memo data:', error);
    }
  };
  
  

  useEffect(() => {


    fetchData();
    console.log(locations);

  }, []);

  return (
    <div className="lens w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <header className="flex flex-row justify-between mb-4">
        <Link to={'/createMemo?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Create Memo</Link>
        <Link to={'/profile?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Profile</Link>
        <Link to={'/dashboard?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Dashboard</Link>
      </header>
      <h1 className="text-blue-800 text-3xl mb-4">Lens</h1>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <Map locations={locations} />
    </div>
  );
};

export default Lens;