import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Success() {
  const navigate = useNavigate();

  const handleNewTranscription = () => {
    navigate('/');
  };

  return (
    <div className="App">
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
        <div className="checkmark-container">
          <img src="/check.png" alt="Checkmark" className="checkmark" />
        </div>
        <div className="prompt-container">
          <p>Transcription saved successfully!<br /><br />When the results are available we will use your observations to help understand the student's results.</p>
          <button onClick={handleNewTranscription} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Start New Transcription
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;
