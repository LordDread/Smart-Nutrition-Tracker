import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar CSS
import './MealLogPage.css'; // Import the custom CSS for MealLogPage
import axios from 'axios';

function MealLogPage() {
  const [date, setDate] = useState(new Date());
  const [calorieData, setCalorieData] = useState({}); // Stores total calories for each day
  const [mealData, setMealData] = useState({}); // Stores meal data for each day
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
        const dayDate = new Date(day.date).toDateString(); // Convert date to string for easy lookup
        calorieData[dayDate] = day.meals.reduce((total, meal) => total + meal.calories, 0); // Sum calories
        mealData[dayDate] = day.meals; // Store meals for the day
      });

      setCalorieData(calorieData);
      setMealData(mealData);
    } catch (error) {
      console.error('Error fetching meal logs:', error);
    }
  };

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
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
    </div>
  );
}

export default MealLogPage;