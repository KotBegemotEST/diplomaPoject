import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginedHeader() {
  const [isReady, setIsReady] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loginStatus');
    const username2 = localStorage.getItem('username');
    if (loggedInUser) {
      setLoginStatus(true);
      setUsername(username2);
    }
    setIsReady(true);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('username');
    setLoginStatus(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <>
      {isReady && loginStatus ? (
        <div className='loginedHeader'>
          <div>
            <span className='logo'>EduFinance</span>
          </div>
          <div className='loginedMenu'>
            <a href='/HourlyRates' className='menu-item'>
              hourly rates
            </a>
            <a href='/extraRates' className='menu-item'>
              Extra hours
            </a>
            <a href='/total' className='menu-item'>
              Total
            </a>
            <a href="/salarySend" className='menu-item'>
              Generate salary blank
            </a>
          </div>
          <div className='info-bar'>
            <span> You: {username} </span>
            <span className="logout" onClick={handleLogout}> Logout</span>
          </div>

        </div>
      ) : null}
    </>
  );
}