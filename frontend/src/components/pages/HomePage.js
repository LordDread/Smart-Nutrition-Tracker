import React, { useState } from 'react';
import axios from 'axios';

function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send the prompt to the backend server
      const res = await axios.post('http://localhost:8081/api/query', { prompt });
      setResponse(JSON.stringify(res.data, null, 2)); // Ensure the response is correctly processed and formatted as JSON
    } catch (error) {
      console.error('Error querying LM:', error);
      setResponse('Failed to get a response from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>

      {/* Query Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here"
          rows={4}
          cols={50}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
        <br />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {/* Display Response */}
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>Response:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}

export default HomePage;