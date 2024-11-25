import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [breakValue, SetBreakValue] = useState(5);
  const [sessionValue, SetSessionValue] = useState(25);
  const [Timer, setTimer] = useState(`${25}:00`);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Total time in seconds
  const timer = useRef(null);
  const [runningId, setRunningId] = useState("session")

  const RemoveClick = ()=> {
    document.getElementById("break-decrement").style.pointerEvents = "none";
    document.getElementById("break-increment").style.pointerEvents = "none";
    document.getElementById("session-decrement").style.pointerEvents = "none";
    document.getElementById("session-increment").style.pointerEvents = "none";
  }
  const addClick = () =>{
    document.getElementById("break-decrement").style.pointerEvents = "auto";
    document.getElementById("break-increment").style.pointerEvents = "auto";
    document.getElementById("session-decrement").style.pointerEvents = "auto";
    document.getElementById("session-increment").style.pointerEvents = "auto";
  }
  const HandleStart = () =>{
    if (timer.current){
      document.getElementById("start_stop").innerHTML = "Start"
      Pause();
    } else{
      document.getElementById("start_stop").innerHTML = "Pause"
      StartTimer(runningId);
    }
  }
  
  const IncreaseBreakValue = () => {
    if (breakValue < 60) {
      SetBreakValue(breakValue + 1);
    }
  };
  
  const DecreaseBreakValue = () => {
    if (breakValue > 1) {
      SetBreakValue(breakValue - 1);
    }
  };

  const IncreaseSessionValue = () => {
    if (sessionValue < 60) {
      const newSession = sessionValue + 1;
      SetSessionValue(newSession);
      setTimer(`${newSession < 10 ? `0${newSession}` : newSession}:00`);
      setTimeLeft(newSession * 60); // Update total time
    }
  };
  
  const DecreaseSessionValue = () => {
    if (sessionValue > 1) {
      const newSession = sessionValue - 1;
      SetSessionValue(newSession);
      
      setTimer(`${newSession < 10 ? `0${newSession}` : newSession}:00`);
      
      setTimeLeft(newSession * 60);
    }
  };

  const StartBreak = () => {
    // Ensure the break time is set correctly by using the current break value
    const breakTimeInSeconds = breakValue * 60;
    
    setTimeLeft(breakTimeInSeconds); // Set the time left for the break timer
    
    // Update the displayed timer with the correct break value
    setTimer(
      `${breakValue < 10 ? `0${breakValue}` : breakValue}:00`
    );
  
    // Update the label to "Break"
    document.getElementById("timer-label").innerText = "Break";
  
    // Start the break timer after a short delay to allow the UI to update
    setTimeout(() => StartTimer("break"), 400);
  };
  
  
  const StartTimer = (phase) => {
    setRunningId(phase)
    RemoveClick();
    if (timer.current) return; // Prevent multiple intervals
    
    timer.current = setInterval(() => {
      if (phase === "session") {
        document.getElementById("timer-label").innerText = "Session";
      } else if (phase === "break" ){
        document.getElementById("timer-label").innerText = "Break";
      }
      setTimeLeft((prevTimeLeft) => {
        
        const newTimeLeft = prevTimeLeft - 1;
        if (newTimeLeft === 0 && phase === "session") {
          clearInterval(timer.current); // Stop timer when it reaches 0
          timer.current = null;
          setTimer("00:00")
          setTimeout(() => {
            StartBreak();
          }, 1000);
          document.getElementById("beep").play();
          return 0;
        }
        else if (newTimeLeft === 0 && phase === "break") {
          clearInterval(timer.current);
          timer.current = null;
          document.getElementById("beep").play();
          setTimer("00:00")
          setTimeout(() => {
            Reset()
          }, 1000);
          return 0;
        }
        const minutes = Math.floor(newTimeLeft / 60);
        const seconds = newTimeLeft % 60;
        setTimer(`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
        
        
        if (newTimeLeft <= 60) {
          document.getElementById("time-left").style.color = "orange";
        } else {
          document.getElementById("time-left").style.color = "white";
        }
        
        return newTimeLeft;
      });
    }, 1000);
  };
  
  const Pause = () => {
    addClick()
    clearInterval(timer.current); // Clear the interval
    timer.current = null; // Reset the timer reference
  };
  
  const Reset = () => {
    document.getElementById("start_stop").textContent = "Start"
    addClick();
    clearInterval(timer.current);
    timer.current = null;
    SetSessionValue(25);
    SetBreakValue(5);
    setTimer("25:00");
    setRunningId("session")
    setTimeLeft(25 * 60); // Reset total time
    document.getElementById("time-left").style.color = "white";
    document.getElementById("timer-label").innerText = "Session";
    const beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0; // Reset the beep audio
  };
  
  
  return (
    <div className="container">
      <h1>Timer</h1>
      <audio src="/bell.mp3" id='beep'></audio>
      <div className="mainScreen">
        <h5 id="timer-label">Session</h5>
        <p id="time-left">{Timer}</p>
        <button id="start_stop" onClick={HandleStart}>Start</button>
        <button id="reset" onClick={Reset}>Reset</button>
      </div>
      <div className="settings">
        <div className="setting">
          <p id="break-label">Break Length</p>
          <button id="break-decrement" onClick={DecreaseBreakValue}><i className="bi bi-caret-up-fill"></i></button>
          <span id="break-length">{breakValue}</span>
          <button id="break-increment" onClick={IncreaseBreakValue}><i className="bi bi-caret-down-fill"></i></button>
        </div>
        <div className="setting">
          <p id="session-label">Session Length</p>
          <button id="session-decrement" onClick={DecreaseSessionValue}><i className="bi bi-caret-up-fill"></i></button>
          <span id="session-length">{sessionValue}</span>
          <button id="session-increment" onClick={IncreaseSessionValue}><i className="bi bi-caret-down-fill"></i></button>
        </div>
      </div>
    </div>
  );
}

export default App;
