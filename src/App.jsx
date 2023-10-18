import { useRef, useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  // Example code to create a simple tone
  const createOscillator = function (rightSide) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // You can change the wave type
    oscillator.frequency.value = 1000; // Set the frequency

    // Create a channel splitter and merger
    const splitter = audioContext.createChannelSplitter(2); // 2 channels (stereo)
    const merger = audioContext.createChannelMerger(2);

    // Connect the oscillator to the splitter and then to the right channel (channel 1)
    oscillator.connect(splitter);
    splitter.connect(merger, 0, rightSide ? 1 : 0); // Connect the right channel
    merger.connect(audioContext.destination);
    return oscillator;
  };

  const playTone = function () {
    const oscillator = createOscillator();
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 1000);
  };

  return (
    <>
      <h1>Click to play sound</h1>
      <div className="card">
        <button onClick={playTone}>Play Sound</button>
      </div>
    </>
  );
}

export default App;
