import React, { useState, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const [milliseconds, setMilliseconds] = useState<number>(0);
  const [relap, setrelap] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0); // Thời gian bắt đầu ban đầu
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (!isActive) {
      const startTime = Date.now() - milliseconds;
       // Bắt đầu tính thời gian từ thời điểm hiện tại - milliseconds
      setStartTime(startTime);
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        setMilliseconds(elapsedTime);
      }, 10);
      setIsActive(true);
    } else {
      clearInterval(intervalRef.current!);
      setIsActive(false);
    }
  };
  

  const resetTimer = () => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    setMilliseconds(0);
    setLapTimes([]);
  };

  const lapTimer = () => {
  if (isActive) {
    let lapTime;
    if (lapTimes.length === 0) {
      lapTime = milliseconds;
    } else {
      lapTime = milliseconds - lapTimes.reduce((prev, curr) => prev + curr, 0);
    }
    setLapTimes([...lapTimes, lapTime]);
  }
};


  const formatTime = (time: number): string => {
    const milliseconds = Math.floor(time % 1000);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().slice(0, 2).padStart(2, '0')}`;
  };
  
  return (
  <div className="App">
    <div className="timer">{formatTime(milliseconds)}</div>
    <div className="buttons">
      <button onClick={startTimer}>{isActive ? 'Pause' : 'Start'}</button>
      <button onClick={isActive ? lapTimer : resetTimer}>{isActive ? 'Lap' : 'Reset'}</button>
    </div>
    {lapTimes.length > 0 && (
      <div className="lap-times">
        <table>
        <thead>
            <tr>
              <th>Lap</th>
              <th>Time</th>
              <th>Total Time</th>
            </tr>
          </thead>
          <tbody>
            {lapTimes.map((time, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{formatTime(time)}</td>
                <td>{formatTime(lapTimes.slice(0, index + 1).reduce((prev, curr) => prev + curr, 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

};

export default App;
