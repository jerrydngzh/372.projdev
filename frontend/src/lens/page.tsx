// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Map from './map';
import { Link } from 'react-router-dom';
import { UserController } from '../controllers/user.controller';

import { MemoController } from '../controllers/memo.controller'

interface Location {
  coordinates: [number, number];
  memo: { memo: string; selectedCategories: string[] }[];
}

const Lens: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userID, setUserID] = useState('');
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  
  const fetchData = async () => {
    try {
      // NOTE: search for userID in path as query variable
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setUserID(idFromQuery);
      
      const data = await UserController.get_user_profile(idFromQuery)
      setUserData(data);

      // memos is an array of memo IDs :: string
      fetchMemos(data.memos);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

  };

  const fetchMemos = async (memoID: any) => {
    try { 
      const fetchedLocations: Location[] = [];
      for (const mid of memoID) {
        // FIXME
        // const response = await fetch(`http://localhost:3000/api/memos/${userID}/${mid}`);
        // const memoData = await response.json();

        const result = await MemoController.get_memo(userID, mid);
        
        const locationName = result.location.name;
        const coordinates = result.location.coordinates;
        const memo = { title: result.name, memo: result.description, selectedCategories: result.tags };
        
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
        <Link to={'/createMemo?id='+userID+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Create Memo</Link>
        <Link to={'/profile?id='+userID+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Profile</Link>
        <Link to={'/dashboard?id='+userID+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Dashboard</Link>
      </header>
      <h1 className="text-blue-800 text-3xl mb-4">Lens</h1>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <Map locations={locations} />
    </div>
  );
};

export default Lens;