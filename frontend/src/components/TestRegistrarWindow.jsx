import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TestRegistrarWindow = () => {
  const { window } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('TestRegistrarWindow - State:', {
      window,
      user: !!user,
      isAuthenticated,
      authLoading
    });

    if (!authLoading && isAuthenticated && user) {
      fetchData();
    } else if (!authLoading && !isAuthenticated) {
      setError('Not authenticated');
      setLoading(false);
    }
  }, [window, user, isAuthenticated, authLoading]);

  const fetchData = async () => {
    try {
      console.log('TestRegistrarWindow - Fetching data for window:', window);
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      console.log('TestRegistrarWindow - Token exists:', !!token);

      if (!token) {
        setError('No auth token');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:3001/api/queue/registrar/${window}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('TestRegistrarWindow - API Response:', response.data);
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error('TestRegistrarWindow - Error:', error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div>Checking authentication...</div>;
  }

  if (loading) {
    return <div>Loading window data...</div>;
  }

  if (error) {
    return (
      <div>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Test Registrar Window: {window}</h1>
      <h2>User: {user?.name}</h2>
      <h3>Window Data:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestRegistrarWindow;
