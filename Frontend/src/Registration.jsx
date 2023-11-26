import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegistration = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:3000/register', {
        username: username,
        password: password,
      });
      if (response.status === 201) {
        setMessage('User registered successfully');
      } else {
        setMessage('Error registering user');
      }
    } catch (error) {
      setMessage('Error registering user');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleRegistration} className="bg-gray-100 rounded-lg shadow-md p-8 w-96">
        <h2 className="text-2xl mb-4 text-center font-semibold">Register</h2>
        <div className="mb-4">
          <input
            className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <input
            className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
            type="submit"
          >
            Register
          </button>
        </div>
        {message && <p className="text-green-500 text-xs italic mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Registration;
