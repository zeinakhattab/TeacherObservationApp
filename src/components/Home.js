import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const navigate = useNavigate();

  const navigateToApp = () => {
    navigate('/app');
  };

  return (
    <div className="Home">
      <div className="logo-container">
        <img className="logo" src="/Alpaca-logo.png" alt="Logo" />
        <span className="title">Recording</span>
      </div>
      <div className="top-right-container">
        <div style={{ width: '66px', height: '60px', left: '27px', top: '0px', position: 'absolute', background: '#4C4C4C', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '9999px' }}></div>
        <div style={{ width: '39px', height: '40px', left: '83px', top: '10px', position: 'absolute', background: '#4C4C4C', borderRadius: '9999px', backdropFilter: 'blur(4px)' }}></div>
        <div style={{ width: '39px', height: '40px', left: '0px', top: '10px', position: 'absolute', background: '#4C4C4C', borderRadius: '9999px', backdropFilter: 'blur(4px)' }}></div>
        <img style={{ width: '45px', height: '45px', left: '38px', top: '7px', position: 'absolute' }} src="/avatar.png" alt="Avatar" />
        <img style={{ width: '30px', height: '30px', left: '4px', top: '15px', position: 'absolute' }} src="/home_icon.png" alt="Home" />
        <img style={{ width: '30px', height: '30px', left: '89px', top: '15px', position: 'absolute' }} src="/logout_icon.png" alt="Logout" />
      </div>
      <div className="rounded-rect">
        <div className="instruction-text">
          Please start<br/>your recording
        </div> 
        <div className="arrow"></div>
        <div className="button-container">
          <button onClick={navigateToApp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
