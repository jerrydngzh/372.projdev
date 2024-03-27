// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Popup from './Popup';
import './style.css';
import { Link } from 'react-router-dom';
import { UserController } from '../controllers/user.controller';

const Dashboard = () => {
  const [tags, setTags] = useState([]);
  const [locations, setLocations] = useState({});
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [id, setID] = useState('');
  const [selectedLocationPop, setSelectedLocationPop] = useState(null);
  const [expandedLocations, setExpandedLocations] = useState({});
  const [newTag, setNewTag] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  const [reloadDashboard, setReloadDashboard] = useState(true);
  const [key, setReloadKey] = useState(true);
  const [popReload, setPopReload] = useState(true);

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setID(idFromQuery);
      
      const data = await UserController.get_user_profile(idFromQuery)
      setUserData(data);
      setTags(data.tags || []);
      fetchMemos(data.memos);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchMemos = async (memoID) => {
    const Loc = {};
    const mem = {};
    for (const id of memoID) {
      try {
        // FIXME
        const response = await fetch(`http://localhost:3000/api/memos/${id}`);
        const data = await response.json(); 
        mem[id] = data;



        Loc[data.location.name] = data.location.coordinates;
      } catch (error) {
        console.error('Error fetching memo data:', error);
      }
    }
    setMemos({...memos, mem});
    setLocations({...locations, ...Loc});
  };

  const handlePopupSubmit = () => {
    // Update any state or perform actions needed after submitting the popup
    // For example, you can reload data or refresh the popup by updating its key
    setReloadKey(prevKey => !prevKey); // Toggle the key to force re-rendering of the popup
    setPopReload(false);
    setShowPopup(true);
  };
  
  useEffect(() => {
    if (reloadDashboard) {
      fetchData();
      setReloadDashboard(false);
    }
    //console.log(memos);
    //console.log(locations);
  }, [reloadDashboard]);

  const handleLocationClick = (locationName) => {
    setSelectedLocation(locationName);
    setExpandedLocations({
      ...expandedLocations,
      [locationName]: !expandedLocations[locationName]
    });
  };

  const handleMemoClick = (memo, locationName) => {
    setSelectedMemo(memo);
    setSelectedLocationPop(locationName);
    setShowPopup(true);
  };

  const handleTagChange = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((cat) => cat !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    setReloadDashboard(true);
  };

  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
    setReloadDashboard(true);
  };

  const handleAddTag = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get('id') || '';
    if (newTag.trim() !== '' && !tags.includes(newTag)) {
      try {
        const updateUserResponse  =  await fetch(`http://localhost:3000/api/users/${idFromQuery}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({tags: [...tags, newTag]}),
        });
        const data = await updateUserResponse .json();
        if (data.success) {
          setTags([...tags, newTag]);
          setNewTag('');
        }
      } catch (error) {
        console.error('Error updating tags:', error);
      }
    }
    setReloadDashboard(true);
  };

  const handleDeleteTag = async (tagToDelete) => {
    const remainingTags = tags.filter((tag) => tag !== tagToDelete);
    try {
      const updatedLocations = { ...locations };
      for (const location in updatedLocations) {
        for (const memoId in memos.mem) {
          const memo = memos.mem[memoId];
          if (memo.location.name === location && memo.tags.includes(tagToDelete)) {
            const updatedTags = memo.tags.filter((cat) => cat !== tagToDelete);
            memo.tags = updatedTags;
            
            // FIXME
            await fetch(`http://localhost:3000/api/memos/${memo._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ tags: updatedTags }),
            });
          }
        }
      }

      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      await fetch(`http://localhost:3000/api/users/${idFromQuery}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: remainingTags }),
      });
      setTags(remainingTags);
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
    setReloadDashboard(true);
  };

  const handleUpdateMemoTags = async (updatedTags, memoid) => {
    setSelectedMemo({
      ...selectedMemo,
      selectedTags: updatedTags
    });

    try {
      // FIXME
      await fetch(`http://localhost:3000/api/memos/${memoid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags: updatedTags}),
      });
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      const updatedUserTags = [...tags, ...updatedTags.filter((cat) => !tags.includes(cat))];
      await fetch(`http://localhost:3000/api/users/${idFromQuery}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags: updatedUserTags}),
      });
      setTags(updatedUserTags);
    } catch (error) {
      console.error('Error updating memo tags:', error);
    }
    setReloadDashboard(true);
  };

  const filteredLocations = Object.keys(locations).reduce((filtered, locationName) => {
    const filteredMemos = [];
      for (const memoId in memos.mem) {
        //console.log(memos.mem[memoId]);
        const memo = memos.mem[memoId];
        
        if (memo.location.name === locationName && selectedTags.every(tag => memo.tags.includes(tag))) {
          filteredMemos.push(memo);
        }
      }
  
    if (filteredMemos.length > 0) {
      filtered[locationName] = {
        ...locations[locationName],
        memo: filteredMemos
      };
    }
  
    return filtered;
  }, {});

  const handleDeleteMemo = async (memo: any, event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.stopPropagation();
    console.log(memo);
    try {
      // Make a DELETE request to the delete memo API route
      // FIXME
      const response = await fetch(`http://localhost:3000/api/memos/${memo._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
        // Update userData.memos array by removing the deleted memo
      const updatedMemos = userData.memos.filter(m => m !== memo._ixdx);

      let newUserData = userData
      newUserData.memos = updatedMemos
      setUserData(newUserData);

      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';

      // Update user data by sending a PUT request
      const editResponse = await UserController.update_user(idFromQuery, newUserData)
      console.log('Edited user: ', editResponse)

      setReloadDashboard(true);
      // Optionally handle success response
    } catch (error) {
      console.error('Error deleting memo:', error);
      // Provide user feedback or handle error state
    }
  };
  

  return (
    <div className="dashboard-container w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">  
      <header className="flex flex-row justify-between mb-4">
        <Link to={'/createMemo?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-1 text-center rounded-lg'>Create Memo</Link>
        <Link to={'/profile?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-1 text-center rounded-lg'>Profile</Link>
        <Link to={'/lens?id='+id+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-1 text-center rounded-lg'>Lens</Link>
      </header>

      <h1 className='text-blue-800 mb-6'>Memo Dashboard</h1>
      <div className="tags-container">
        <h2 className="text-blue-800">Tags</h2>
        <div className="tags-table">
          <div className="tag-row add-tag-row">
            <input
              type="text"
              value={newTag}
              onChange={handleNewTagChange}
              placeholder="Enter new tag"
              className="tag-input"
            />
            <button onClick={handleAddTag} className='bg-blue-100 text-blue-800 border-2 border-blue-800 w-1/6'>Add</button>
          </div>
          {tags.map((tag, index) => (
            <div key={index} className="tag-row">
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
                className="tag-checkbox"
              />
              <span>{tag}</span>
              <button onClick={() => handleDeleteTag(tag)} className="delete-tag-button">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-blue-800 text-lg">Locations</h2>
        {Object.keys(filteredLocations).length === 0 ? (
          <p className="italic text-blue-800 opacity-80">No locations to display.</p>
        ) : (
          Object.keys(filteredLocations).map((locationName) => (
            <div key={locationName} className="location-box" onClick={() => handleLocationClick(locationName)}>
              <h3>{locationName}</h3>
              {expandedLocations[locationName] && (
                <div className="memo-box">
                  {filteredLocations[locationName].memo.map((memo, index) => (
                    <div key={index} className="memo" onClick={() => handleMemoClick(memo, locationName)}>
                      {memo.description}
                      <button onClick={(event) => handleDeleteMemo(memo, event)} className="delete-tag-button">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showPopup && selectedMemo && selectedLocationPop && (
        <Popup
          key={selectedMemo._id}
          selectedMemo={selectedMemo}
          selectedLocationPop={selectedLocationPop}
          tags={memos.tags}
          handleUpdateTags={handleUpdateMemoTags}
          handleClose={() => setShowPopup(false)}
          handlePopupSubmit={handlePopupSubmit} 
          Key = {popReload}
        />
      )}
    </div>
  );
};

export default Dashboard;
