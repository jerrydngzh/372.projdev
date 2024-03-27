// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react';

const Popup = ({ selectedMemo, selectedLocationPop, tags, handleUpdateTags, handleClose, handlePopupSubmit, Key }) => {
  const [newTag, setNewTag] = useState('');
  const [reloadKey, setReloadKey] = useState(Key);

  useEffect(() => {
    if (reloadKey) {
      setNewTag('');
      setReloadKey(false);
      handlePopupSubmit();
    }
    console.log(selectedMemo);
  }, [reloadKey, selectedMemo]);

  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = async () => {
    if (newTag.trim() !== '') {
      handleUpdateTags([...selectedMemo.tags, newTag], selectedMemo._id);

      try {
        // FIXME
        await fetch(`http://localhost:3000/api/memos/${selectedMemo._id}`);
        setReloadKey(Date.now()); // Reload by updating reloadKey
      } catch (error) {
        console.error('Error fetching memo data:', error);
      }
      setNewTag('');
      setReloadKey(true);
      
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = selectedMemo.tags.filter(tag => tag !== tagToRemove);
    handleUpdateTags(updatedTags, selectedMemo._id);
    try {
      // FIXME
      await fetch(`http://localhost:3000/api/memos/${selectedMemo._id}`);
      setReloadKey(Date.now()); // Reload by updating reloadKey
    } catch (error) {
      console.error('Error fetching memo data:', error);
    }
    handleClose();
    setReloadKey(true);
  };

  return (
    <div className="popup">
      <h2>Memo Details</h2>
      <p><strong>Title:</strong> {selectedMemo.name}</p>
      <p><strong>Memo:</strong> {selectedMemo.description}</p>
      <p><strong>Location:</strong> {selectedMemo.location.name}</p>
      <p><strong>Coordinates:</strong> {selectedMemo.location.coordinates}</p>
      <p><strong>Tags:</strong>
        {selectedMemo.tags.map((tag, index) => (
          <span key={index}>
            {tag}
            <button onClick={() => handleRemoveTag(tag)}>Remove</button>
          </span>
        ))}
      </p>
      <div>
        <input
          type="text"
          value={newTag}
          onChange={handleNewTagChange}
          placeholder="Enter new tag"
        />
        <button onClick={handleAddTag}>Add</button>
      </div>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Popup;
