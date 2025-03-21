import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar CSS
import './MealLogPage.css'; // Import the custom CSS for MealLogPage
import axios from 'axios';

function MealLogPage() {
  const [date, setDate] = useState(new Date());
  const [calorieData, setCalorieData] = useState({}); // Stores total calories for each day
  const [mealData, setMealData] = useState({}); // Stores meal data for each day
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [newMealName, setNewMealName] = useState(''); // Stores the new meal name
  const [newMealTime, setNewMealTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // Default to current time in HH:mm format
  }); // Stores the new meal time
  const [newMealDescription, setNewMealDescription] = useState(''); // Stores the new meal description
  const [errorMessage, setErrorMessage] = useState(''); // Stores error messages
  const [successMessage, setSuccessMessage] = useState(''); // Stores success messages
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state
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
  
      // Construct the URL with query parameters
      const url = `http://localhost:8081/user/${userId}/meals?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
  
      // Make the GET request
      const response = await axios.get(url);
  
      const mealLogs = response.data.mealLog;
      const calorieData = {};
      const mealData = {};
  
      // Process meal logs to calculate total calories for each day
      mealLogs.forEach((day) => {
        // Normalize the date to midnight UTC
        const normalizedDate = new Date(day.date);
        normalizedDate.setUTCHours(0, 0, 0, 0);
  
        // Convert UTC date to local date
        const localDate = new Date(normalizedDate.getTime() + normalizedDate.getTimezoneOffset() * 60000);
  
        const dayDate = localDate.toDateString(); // Convert local date to string for easy lookup
        calorieData[dayDate] = day.meals.reduce((total, meal) => total + meal.calories, 0); // Sum calories
        mealData[dayDate] = day.meals; // Store meals for the day
      });
  
      setCalorieData(calorieData);
      setMealData(mealData);
    } catch (error) {
      console.error('Error fetching meal logs:', error);
    }
  };

  const handleAddMeal = async () => {
    setErrorMessage(''); // Clear any previous error messages
    setSuccessMessage(''); // Clear any previous success messages
    setIsLoading(true); // Set loading state to true
  
    try {  
      // Step 1: Send the description (prompt) to the API
      const res = await axios.post('http://localhost:8081/api/query', { prompt: newMealDescription });
  
      // Step 2: Extract the JSON string from res.data.choices.text
      const textResponse = res.data; // Assuming the JSON is within this field
      
  
      // Step 3: Format the parsed JSON into the correct structure for the database
      const formattedData = {
        mealName: newMealName || textResponse.mealName || 'Default Meal Name',
        description: newMealDescription,
        date: date.toISOString(), // Use the normalized date
        time: newMealTime, // Use the user-provided time
        calories: textResponse.calories || 0,
        carbs: textResponse.carbs || 0,
        protein: textResponse.protein || 0,
        fat: textResponse.fat || 0,
        fiber: textResponse.fiber || 0,
        sugar: textResponse.sugar || 0,
        sodium: textResponse.sodium || 0,
        cholesterol: textResponse.cholesterol || 0,
        vitaminA: textResponse.vitaminA || 0,
        vitaminB2: textResponse.vitaminB2 || 0,
        vitaminB6: textResponse.vitaminB6 || 0,
        vitaminB12: textResponse.vitaminB12 || 0,
        vitaminC: textResponse.vitaminC || 0,
        vitaminD: textResponse.vitaminD || 0,
        vitaminE: textResponse.vitaminE || 0,
        vitaminK: textResponse.vitaminK || 0,
        calcium: textResponse.calcium || 0,
        iron: textResponse.iron || 0,
        magnesium: textResponse.magnesium || 0,
        potassium: textResponse.potassium || 0,
        zinc: textResponse.zinc || 0,
      };
  
      // Step 4: Send the formatted data to the database
      const response = await axios.post(`http://localhost:8081/user/${userId}/meal`, formattedData);
  
      console.log('Meal added:', response.data);
  
      // Refresh the meal logs after adding a new meal
      fetchMealLogs();
  
      // Close the modal and reset the form
      setIsModalOpen(false);
      setNewMealName('');
      setNewMealTime(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // Reset to current time
      });
      setNewMealDescription('');
      setSuccessMessage('Meal successfully added!'); // Set success message
    } catch (error) {
      console.error('Error adding meal:', error);
      setErrorMessage(error.response?.data?.error || 'An error occurred while adding the meal.');
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = new Date(date).toDateString(); // Normalize the date for lookup
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
        <Calendar onChange={onChange} value={date} locale="en-US" tileContent={tileContent} />
      </div>
      <div className="add-meal-button-container">
        <button onClick={() => setIsModalOpen(true)} className="add-meal-button">
          Add Meal
        </button>
      </div>
      <p>Selected date: {date.toDateString()}</p>
      {mealData[date.toDateString()] && (
        <div className="meal-details">
          <h2>Meals for {date.toDateString()}</h2>
          <ul>
            {mealData[date.toDateString()].map((meal, index) => (
              <li key={index}>
                <strong>{meal.mealName}</strong> at {meal.time} - {meal.calories} Calories
              </li>
            ))}
          </ul>
        </div>
      )}
      {isModalOpen && (
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
              />
            </label>
            <br />
            <label>
              Time:
              <input
                type="time"
                value={newMealTime}
                onChange={(e) => setNewMealTime(e.target.value)}
              />
            </label>
            <br />
            <label>
              Description:
              <textarea
                value={newMealDescription}
                onChange={(e) => setNewMealDescription(e.target.value)}
                placeholder="Enter meal description"
              />
            </label>
            <br />
            {isLoading && <p className="loading-message">Submitting...</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={handleAddMeal} style={{ marginRight: '10px' }} disabled={isLoading}>
              Submit
            </button>
            <button onClick={() => setIsModalOpen(false)} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealLogPage;