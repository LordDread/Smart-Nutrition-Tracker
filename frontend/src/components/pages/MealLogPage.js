import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar CSS
import './MealLogPage.css'; // Import the custom CSS for MealLogPage
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Tooltip as ChartTooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, ChartTooltip);

const formatTimeTo12Hour = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
  return `${formattedHour}:${minutes} ${period}`;
};

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
  const [macronutrientData, setMacronutrientData] = useState({}); // Stores macronutrient totals for the 7-day period
  const [micronutrientData, setMicronutrientData] = useState({}); // Stores micronutrient totals for the 7-day period
  const [descriptionError, setDescriptionError] = useState(''); // Tracks description error
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  useEffect(() => {
    fetchMealLogs();
  }, []);

  useEffect(() => {
    calculateMacronutrients();
    calculateMicronutrients();
  }, [date, mealData]);

  const fetchMealLogs = async () => {
    const currentDate = new Date();
    const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    try {
      const startDate = firstDayOfPreviousMonth.toISOString();
      const endDate = lastDayOfCurrentMonth.toISOString();

      const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/${userId}/meals?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
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

  const calculateMacronutrients = () => {
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 6); // 7 days inclusive
    const endDate = new Date(date);

    const totals = { calories: 0, carbs: 0, protein: 0, fat: 0 };

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayString = new Date(d).toDateString();
      const meals = mealData[dayString] || [];
      meals.forEach((meal) => {
        totals.calories += meal.calories || 0;
        totals.carbs += meal.carbs || 0;
        totals.protein += meal.protein || 0;
        totals.fat += meal.fat || 0;
      });
    }

    setMacronutrientData(totals);
  };

  const calculateMicronutrients = () => {
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 6); // 7 days inclusive
    const endDate = new Date(date);
  
    // Initialize totals with schema field names
    const totals = {
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
      vitaminA: 0,
      vitaminB2: 0,
      vitaminB6: 0,
      vitaminB12: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0,
      vitaminK: 0,
      calcium: 0,
      iron: 0,
      magnesium: 0,
      potassium: 0,
      zinc: 0,
    };
  
    // Iterate through the 7-day period
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayString = new Date(d).toDateString();
      const meals = mealData[dayString] || [];
      meals.forEach((meal) => {
        Object.keys(totals).forEach((key) => {
          totals[key] += meal[key] || 0; // Accumulate values for each micronutrient
        });
      });
    }
  
    setMicronutrientData(totals); // Update state with calculated totals
  };

  const prepareMicronutrientChartData = () => {
    const total = Object.values(micronutrientData).reduce((sum, value) => sum + value, 0);
    const data = [];
    const labels = [];
    const otherContents = [];
  
    // Map internal keys to display labels
    const labelMapping = {
      fiber: 'Fiber',
      sugar: 'Sugar',
      sodium: 'Sodium',
      cholesterol: 'Cholesterol',
      vitaminA: 'Vitamin A',
      vitaminB2: 'Vitamin B2',
      vitaminB6: 'Vitamin B6',
      vitaminB12: 'Vitamin B12',
      vitaminC: 'Vitamin C',
      vitaminD: 'Vitamin D',
      vitaminE: 'Vitamin E',
      vitaminK: 'Vitamin K',
      calcium: 'Calcium',
      iron: 'Iron',
      magnesium: 'Magnesium',
      potassium: 'Potassium',
      zinc: 'Zinc',
    };
  
    Object.entries(micronutrientData).forEach(([key, value]) => {
      if (value === 0) return; // Skip 0% values
      const percentage = (value / total) * 100;
      if (percentage < 2) {
        // Push title-cased labels into the "Other" category
        otherContents.push(`${labelMapping[key] || key}: ${value}`);
      } else {
        data.push(value);
        labels.push(labelMapping[key] || key); // Use the mapped label or fallback to the key
      }
    });
  
    if (otherContents.length > 0) {
      data.push(otherContents.reduce((sum, value) => sum + parseFloat(value.split(': ')[1]), 0));
      labels.push('Other'); // Add "Other" as a category
    }
  
    return {
      data,
      labels,
      otherContents,
    };
  };

  const micronutrientChartData = prepareMicronutrientChartData();
  const micronutrientPieChartData = {
    labels: micronutrientChartData.labels,
    datasets: [
      {
        data: micronutrientChartData.data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
          '#8A2BE2', '#5F9EA0', '#7FFF00', '#DC143C', '#FFD700', '#ADFF2F',
          '#FF4500', '#DA70D6', '#00CED1', '#1E90FF', '#32CD32', '#FF1493'
        ], // Ensure all colors are distinct
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
          '#8A2BE2', '#5F9EA0', '#7FFF00', '#DC143C', '#FFD700', '#ADFF2F',
          '#FF4500', '#DA70D6', '#00CED1', '#1E90FF', '#32CD32', '#FF1493'
        ], // Ensure hover colors are also distinct
      },
    ],
  };

  const micronutrientTooltip = {
    callbacks: {
      label: function (tooltipItem) {        
        const label = tooltipItem.label;        
        const value = parseFloat(tooltipItem.raw).toFixed(2); // Cap value to 2 decimal places
        let unit = '';

        // Determine the unit based on the label
        if (label.includes('Sodium') || label.includes('Potassium') || label.includes('Calcium') || label.includes('Magnesium') || label.includes('Iron') || label.includes('Zinc')) {
          unit = 'mg';
        } else if (label.includes('Vitamin A') || label.includes('Vitamin D') || label.includes('Vitamin K')) {
          unit = 'µg';
        } else if (label.includes('Fiber') || label.includes('Sugar') || label.includes('Protein') || label.includes('Carbs') || label.includes('Fat')) {
          unit = 'g';
        }

        if (label === 'Other') {
          return micronutrientChartData.otherContents.map((content) => {
            const [key, val] = content.split(': ');
            const cappedValue = parseFloat(val).toFixed(2); // Cap value to 2 decimal places
            let otherUnit = '';
            if (key.includes('Sodium') || key.includes('Potassium') || key.includes('Calcium') || key.includes('Magnesium') || key.includes('Iron') || key.includes('Zinc')) {
              otherUnit = 'mg';
            } else if (key.includes('Vitamin A') || key.includes('Vitamin D') || key.includes('Vitamin K')) {
              otherUnit = 'µg';
            } else if (key.includes('Fiber') || key.includes('Sugar') || key.includes('Protein') || key.includes('Carbs') || key.includes('Fat')) {
              otherUnit = 'g';
            }
            return `${key}: ${cappedValue} ${otherUnit}`;
          });
        }
        return `${label}: ${value} ${unit}`;
      },
    },
  };

  const handleAddMeal = async () => {
    if (newMealDescription.trim() === '') {
      setDescriptionError('Description cannot be blank.');
      return;
    }
    setDescriptionError(''); // Clear any previous error
    setIsSubmitting(true); // Set submitting state to true
    try {
      const mealName = newMealName.trim() === '' ? `Meal @ ${formatTimeTo12Hour(newMealTime)}` : newMealName;

      const newMeal = {
        mealName: mealName,
        date: date.toISOString().slice(0, 10), // Format date as YYYY-MM-DD
        time: newMealTime,
        description: newMealDescription,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/${userId}/meal`, newMeal);

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
    if (newMealDescription.trim() === '') {
      setDescriptionError('Description cannot be blank.');
      return;
    }
    setDescriptionError(''); // Clear any previous error
    setIsSubmitting(true); // Set submitting state to true
    try {
      const mealName = newMealName.trim() === '' ? `Meal @ ${formatTimeTo12Hour(newMealTime)}` : newMealName;

      const updatedMeal = {
        mealName: mealName,
        date: editMealDate, // Send the date from the "folder"
        time: newMealTime,
        description: newMealDescription,
      };

      await axios.put(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/${userId}/meal/${editMealId}`, updatedMeal);

      fetchMealLogs(); // Refresh the meal logs
      setIsEditModalOpen(false); // Close the modal
      clearEditFields(); // Clear the edit fields
    } catch (error) {
      console.error('Error editing meal:', error);
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  const handleDeleteMeal = async () => {
    if (!editMealId) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this meal? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    setIsSubmitting(true); // Set submitting state to true
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/${userId}/meal/${editMealId}`
      );

      fetchMealLogs(); // Refresh the meal logs
      setIsEditModalOpen(false); // Close the modal
      clearEditFields(); // Clear the edit fields
    } catch (error) {
      console.error('Error deleting meal:', error);
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

  const closeAddModal = () => {
    setNewMealName('');
    setNewMealTime('');
    setNewMealDescription('');
    setDescriptionError(''); // Clear the error message
    setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    clearEditFields(); // Clear the edit fields
    setDescriptionError(''); // Clear the error message
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

  const pieChartData = {
    labels: ['Calories', 'Carbs', 'Protein', 'Fat'],
    datasets: [
      {
        data: [macronutrientData.calories, macronutrientData.carbs, macronutrientData.protein, macronutrientData.fat],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const macronutrientTooltip = {
    callbacks: {
      label: function (tooltipItem) {
        const label = tooltipItem.label;
        const value = parseFloat(tooltipItem.raw).toFixed(2); // Cap value to 2 decimal places
        let unit = '';

        // Determine the unit based on the label
        if (label === 'Calories') {
          unit = 'kcal';
        } else {
          unit = 'g';
        }

        return `${label}: ${value} ${unit}`;
      },
    },
  };

  return (
    <div className="meal-log-page">
      <h1>Meal Log</h1>
      <div className="content-container">
        <div className="calendar-container">
          {/* Add instructional text above the calendar */}
          <p className="calendar-instructions">
            To add a meal, select a day and click Add Meal.
          </p>
          <Calendar onChange={setDate} value={date} tileContent={tileContent} />
          {/* Moved buttons below the calendar */}
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
        </div>
        <div className="chart-container">
          <h3>Macronutrients (Last 7 Days)</h3>
          <Pie data={pieChartData} options={{ plugins: { tooltip: macronutrientTooltip } }} />
          <h3>Micronutrients (Last 7 Days)</h3>
          <Pie data={micronutrientPieChartData} options={{ plugins: { tooltip: micronutrientTooltip } }} />
        </div>
      </div>

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
                placeholder="Enter a description of the meal, for example: I ate a fried egg and 2 breakfast sausages."
                rows={4}
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
            <br />
            {descriptionError && <p className="error-text">{descriptionError}</p>} {/* Display description error */}
            {isSubmitting && <p className="submitting-text">Submitting...</p>} {/* Display "Submitting..." */}
            <button onClick={handleAddMeal} disabled={isSubmitting}>
              Submit
            </button>
            <button onClick={closeAddModal} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Edit Meal</h2>
            <div className="edit-modal-content">
              {/* Form Section */}
              <div className="form-column">
                <label>
                  Select Meal:
                  <select
                    value={editMealId || ''}
                    onChange={(e) => {
                      const selectedMealId = e.target.value;
                      const selectedMeal = mealData[date.toDateString()].find(
                        (meal) => meal._id === selectedMealId
                      );
                      if (selectedMeal) {
                        setEditMealId(selectedMeal._id); // Set the meal ID
                        setNewMealName(selectedMeal.mealName); // Populate meal name
                        setNewMealTime(selectedMeal.time); // Populate meal time
                        setNewMealDescription(selectedMeal.description); // Populate meal description
                        setEditMealDate(new Date(date).toISOString().slice(0, 10)); // Populate meal date
                      }
                    }}
                    disabled={isSubmitting} // Disable dropdown while submitting
                  >
                    <option value="" disabled>
                      Select a meal
                    </option>
                    {mealData[date.toDateString()] &&
                      mealData[date.toDateString()].map((meal) => (
                        <option key={meal._id} value={meal._id}>
                          {meal.mealName} - {formatTimeTo12Hour(meal.time)}
                        </option>
                      ))}
                  </select>
                </label>
                <br />
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
                    rows={4}
                    placeholder="Enter meal description"
                    disabled={isSubmitting} // Disable input while submitting
                  />
                </label>
                <br />
                {descriptionError && <p className="error-text">{descriptionError}</p>} {/* Display description error */}
                {isSubmitting && <p className="submitting-text">Submitting...</p>} {/* Display "Submitting..." */}
                <button onClick={handleEditSubmit} disabled={isSubmitting}>
                  Save Changes
                </button>
                <button onClick={closeEditModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMeal}
                  className="delete-meal-button"
                  disabled={isSubmitting}
                >
                  Delete
                </button>
              </div>

              {/* Nutritional Information Section */}
              <div className="nutrition-column">
                <h3>Nutritional Information</h3>
                {editMealId && (
                  <ul>
                    <li>
                      <span>Calories:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.calories || 0}</span>
                    </li>
                    <li>
                      <span>Carbs:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.carbs || 0}g</span>
                    </li>
                    <li>
                      <span>Protein:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.protein || 0}g</span>
                    </li>
                    <li>
                      <span>Fat:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.fat || 0}g</span>
                    </li>
                    <li>
                      <span>Fiber:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.fiber || 0}g</span>
                    </li>
                    <li>
                      <span>Sugar:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.sugar || 0}g</span>
                    </li>
                    <li>
                      <span>Sodium:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.sodium || 0}mg</span>
                    </li>
                    <li>
                      <span>Vitamin A:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.vitaminA || 0}µg</span>
                    </li>
                    <li>
                      <span>Vitamin C:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.vitaminC || 0}mg</span>
                    </li>
                    <li>
                      <span>Vitamin D:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.vitaminD || 0}µg</span>
                    </li>
                    <li>
                      <span>Vitamin E:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.vitaminE || 0}mg</span>
                    </li>
                    <li>
                      <span>Vitamin K:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.vitaminK || 0}µg</span>
                    </li>
                    <li>
                      <span>Calcium:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.calcium || 0}mg</span>
                    </li>
                    <li>
                      <span>Iron:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.iron || 0}mg</span>
                    </li>
                    <li>
                      <span>Magnesium:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.magnesium || 0}mg</span>
                    </li>
                    <li>
                      <span>Potassium:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.potassium || 0}mg</span>
                    </li>
                    <li>
                      <span>Zinc:</span>
                      <span>{mealData[date.toDateString()].find((meal) => meal._id === editMealId)?.zinc || 0}mg</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealLogPage;