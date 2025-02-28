import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar CSS
import './MealLogPage.css'; // Import the custom CSS for MealLogPage

function MealLogPage() {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState({});
  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleAddEdit = () => {
    setIsAddEditModalVisible(true);
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const handleSaveData = (newData) => {
    setData({ ...data, [date.toDateString()]: newData });
    setIsAddEditModalVisible(false);
  };

  const handleConfirmDelete = () => {
    const newData = { ...data };
    delete newData[date.toDateString()];
    setData(newData);
    setIsDeleteModalVisible(false);
  };

  return (
    <div className="meal-log-page">
      <h1>Meal Log</h1>
      <div className="calendar-container">
        <Calendar onChange={onChange} value={date} locale="en-US" />
      </div>
      <p>Selected date: {date.toDateString()}</p>
      <div className="buttons-container">
        <button onClick={handleAddEdit}>
          {data[date.toDateString()] ? 'Edit' : 'Add'}
        </button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      {isAddEditModalVisible && (
        <AddEditModal
          onClose={() => setIsAddEditModalVisible(false)}
          onSave={handleSaveData}
          existingData={data[date.toDateString()]}
        />
      )}
      {isDeleteModalVisible && (
        <DeleteModal
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

function AddEditModal({ onClose, onSave, existingData }) {
  const [inputValue, setInputValue] = useState(existingData || '');

  const handleSave = () => {
    onSave(inputValue);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>{existingData ? 'Edit Data' : 'Add Data'}</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleSave}>{existingData ? 'Save Changes' : 'Add Data'}</button>
      </div>
    </div>
  );
}

function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete the data?</p>
        <button onClick={onConfirm}>Yes, Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default MealLogPage;