'use client'
import {Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserController } from '../controllers/user.controller';

const Profile = () => {
  const [userData, setUserData] = useState<any>({});
  const [id, setID] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get('id') || '';

    // Update the state with the username
    setID(idFromQuery);
    console.log(idFromQuery);
    // Fetch user data from the JSON file
    const fetchData = async () => {
      try {
        const data = await UserController.get_user_profile(idFromQuery)
        console.log('Fetched Account:', data);
        setUserData(data || {});
        
         // Set the data in state
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className='Profile w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800'>

      <header className="flex flex-row justify-between mb-4">
        <Link to={'/createMemo?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Create Memo</Link>
        <Link to={'/dashboard?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Dashboard</Link>
        <Link to={'/lens?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Lens</Link>
        <Link to={'/user'} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Log out</Link>
      </header>

      <h2 className="text-blue-800 text-3xl mb-4">User Profile</h2>
          <p className="italic text-blue-800">Name: {userData.firstname} {userData.lastname}</p>
          <p className="italic text-blue-800">Username: {userData.username}</p>
          <p className="italic text-blue-800">Email: {userData.email}</p>

    </main>
  );
};

export default Profile;
