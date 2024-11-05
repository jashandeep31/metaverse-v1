import React, { useState } from 'react';
import axios from 'axios';
import {useSetRecoilState,atom} from 'recoil';
import { useNavigate } from 'react-router-dom';

  const userStatus = atom({
    key: "userStatus",
    default: false
  })
  

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setStatus = useSetRecoilState(userStatus);
const navigate = useNavigate();


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.error('Invalid email format');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/v1/signin', {
        email,
        password,
      });
      console.log(response);
      if(response.status===200){
        setStatus(true);
        navigate('/space')
        
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-700 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-700 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export  {userStatus,Login};
