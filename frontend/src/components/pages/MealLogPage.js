import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar CSS
import './MealLogPage.css'; // Import the custom CSS for MealLogPage
import axios from 'axios';

function MealLogPage() {
  const [date, setDate] = useState(new Date());
  const [calorieData, setCalorieData] = useState({}); // Stores total calories for each day
  const [mealData, setMealData] = useState({}); // Stores meal data for each day
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controls add modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls edit modal visibility
  const [newMealName, setNewMealName] = useState(''); // Stores the meal name
  const [newMealTime, setNewMealTime] = useState(''); // Stores the meal time
  const [newMealDescription, setNewMealDescription] = useState(''); // Stores the meal description
  const [editMealId, setEditMealId] = useState(null); // Stores the ID of the meal being edited
  const [editMealDate, setEditMealDate] = useState(''); // Stores the date of the meal being edited
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission state
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  useEffect(() => {
    fetchMealLogs();
  }, []);

  const fetchMealLogs = async () => {
    const currentDate = new Date();
    const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    try {
      const startDate = firstDayOfPreviousMonth.toISOString();
      const endDate = lastDayOfCurrentMonth.toISOString();

      const url = `http://localhost:8081/user/${userId}/meals?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
      const response = await axios.get(url);

      const mealLogs = response.data.mealLog;
      const calorieData = {};
      const mealData = {};

      mealLogs.forEach((day) => {
        const normalizedDate = new Date(day.date);
        normalizedDate.setUTCHours(0, 0, 0, 0);

        const localDate = new Date(normalizedDate.getTime() + normalizedDate.getTimezoneOffset() * 60000);
        const dayDate = localDate.toDateString();
        calorieData[dayDate] = day.meals.reduce((total, meal) => total + meal.calories, 0);
        mealData[dayDate] = day.meals;
      });

      setCalorieData(calorieData);
      setMealData(mealData);
    } catch (error) {
      console.error('Error fetching meal logs:', error);
    }
  };

  const handleAddMeal = async () => {
    setIsSubmitting(true); // Set submitting state to true
    try {
      const newMeal = {
        mealName: newMealName,
        date: date.toISOString().slice(0, 10), // Format date as YYYY-MM-DD
        time: newMealTime,
        description: newMealDescription,
      };

      await axios.post(`http://localhost:8081/user/${userId}/meal`, newMeal);

      fetchMealLogs();
      setIsAddModalOpen(false);
      setNewMealName('');
      setNewMealTime('');
      setNewMealDescription('');
    } catch (error) {
      console.error('Error adding meal:', error);
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  const handleEditMeal = (meal, mealDate) => {
    setEditMealId(meal._id); // Set the meal ID
    setNewMealName(meal.mealName); // Set the meal name
    setNewMealTime(meal.time); // Set the meal time
    setNewMealDescription(meal.description); // Set the meal description
    setEditMealDate(new Date(mealDate).toISOString().slice(0, 10)); // Set the date from the "folder" (formatted as YYYY-MM-DD)
    setIsEditModalOpen(true); // Open the edit modal
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true); // Set submitting state to true
    try {
      const updatedMeal = {
        mealName: newMealName,
        date: editMealDate, // Send the date from the "folder"
        time: newMealTime,
        description: newMealDescription,
      };

      await axios.put(`http://localhost:8081/user/${userId}/meal/${editMealId}`, updatedMeal);

      fetchMealLogs(); // Refresh the meal logs
      setIsEditModalOpen(false); // Close the modal
      clearEditFields(); // Clear the edit fields
    } catch (error) {
      console.error('Error editing meal:', error);
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  const clearEditFields = () => {
    setEditMealId(null);
    setNewMealName('');
    setNewMealTime('');
    setNewMealDescription('');
    setEditMealDate('');
  };

  const openAddModal = () => {
    const now = new Date();
    setNewMealTime(now.toTimeString().slice(0, 5)); // Set the time to the current system time in HH:mm format
    setIsAddModalOpen(true);
  };

  const closeEditModal = () => {
    clearEditFields(); // Clear the edit fields
    setIsEditModalOpen(false);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = new Date(date).toDateString();
      if (calorieData[dateString]) {
        return <p>{calorieData[dateString]} Calories</p>;
      }
    }
    return null;
  };

  return (
    <div className="meal-log-page">
      <h1>Meal Log</h1>
      <div className="calendar-container">
        <Calendar onChange={setDate} value={date} tileContent={tileContent} />
      </div>
      <div className="buttons-container">
        <button onClick={openAddModal} className="add-meal-button">
          Add Meal
        </button>
        <button
          onClick={() => {
            const mealsForDate = mealData[date.toDateString()];
            if (mealsForDate && mealsForDate.length > 0) {
              handleEditMeal(mealsForDate.slice(-1)[0], date); // Pass the last meal and the date
            }
          }}
          className={`edit-meal-button ${
            !mealData[date.toDateString()] || mealData[date.toDateString()].length === 0
              ? 'disabled-button'
              : ''
          }`}
          disabled={
            !mealData[date.toDateString()] || mealData[date.toDateString()].length === 0
          }
        >
          Edit Meal
        </button>
      </div>
      <p>Selected date: {date.toDateString()}</p>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Add a New Meal</h2>
            <label>
              Meal Name:
              <input
                type="text"
                value={newMealName}
                onChange={(e) => setNewMealName(e.target.value)}
                placeholder="Enter meal name"
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
            <br />
            <label>
              Time:
              <input
                type="time"
                value={newMealTime}
                onChange={(e) => setNewMealTime(e.target.value)}
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
            <br />
            <label>
              Description:
              <textarea
                value={newMealDescription}
                onChange={(e) => setNewMealDescription(e.target.value)}
                placeholder="Enter meal description"
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
            <br />
            {isSubmitting && <p className="submitting-text">Submitting...</p>} {/* Display "Submitting..." */}
            <button onClick={handleAddMeal} disabled={isSubmitting}>
              Submit
            </button>
            <button onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Edit Meal</h2>
            <label>
              Meal Name:
              <input
                type="text"
                value={newMealName}
                onChange={(e) => setNewMealName(e.target.value)}
                placeholder="Enter meal name"
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
            <br />
            <label>
              Date:
              <input
                type="date"
                value={editMealDate}
                onChange={(e) => setEditMealDate(e.target.value)}
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
            <br />
            <label>
              Time:
              <input
                type="time"
                value={newMealTime}
                onChange={(e) => setNewMealTime(e.target.value)}
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
            <br />
            <label>
              Description:
              <textarea
                value={newMealDescription}
                onChange={(e) => setNewMealDescription(e.target.value)}
                placeholder="Enter meal description"
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
            <br />
            {isSubmitting && <p className="submitting-text">Submitting...</p>} {/* Display "Submitting..." */}
            <button onClick={handleEditSubmit} disabled={isSubmitting}>
              Save Changes
            </button>
            <button onClick={closeEditModal} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealLogPage;