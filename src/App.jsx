import { useState } from 'react';

function App() {
  const [frequency, setFrequency] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(40); // Initial volume in decibels

  const createOscillator = function (frequency, rightSide) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain(); // Create a GainNode

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const splitter = audioContext.createChannelSplitter(2);
    const merger = audioContext.createChannelMerger(2);

    oscillator.connect(gainNode); // Connect oscillator to the gainNode
    gainNode.connect(splitter);
    splitter.connect(merger, 0, rightSide ? 1 : 0);
    merger.connect(audioContext.destination);

    // Set the gain value based on the volume in decibels
    gainNode.gain.value = Math.pow(10, volume / 20);

    return { oscillator, gainNode };
  };

  const playTone = function (e) {
    setLoading(e.target.dataset.side);
    const { oscillator, gainNode } = createOscillator(frequency, e.target.dataset.side === 'right');
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      setLoading(false);
    }, 1000);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value)); // Update the volume in decibels
  };

  return (
    <>
      <h1 className="text-4xl font-bold my-4">Click to play sound</h1>
      <div>
        <input
          type="number"
          step={1000}
          className="py-2 px-4 rounded-lg bg-gray-300 text-black text-center"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        />
      </div>
      <div className="card flex gap-4 my-4">
        <button
          className="bg-purple-800 outline-2 outline-red-900 p-4 rounded-lg w-40 h-14"
          data-side="left"
          onClick={playTone}
        >
          {loading === 'left' ? '...' : 'Play Left Sound'}
        </button>
        <button
          className="bg-purple-800 outline-2 outline-red-900 p-4 rounded-lg w-40 h-14"
          data-side="right"
          onClick={playTone}
        >
          {loading === 'right' ? '...' : 'Play Right Sound'}
        </button>
      </div>
      <div className='flex items-center gap-3 justify-center'>
        <input
          type="range"
          min={0}
          max={100}
          step={10}
          value={volume}
          onChange={handleVolumeChange}
        />
        <span>{volume} dB</span>
      </div>
    </>
  );
}

export default App;
