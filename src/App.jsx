import { useState } from 'react';

function App() {
  // Example code to create a simple tone
  const [frequency, setFrequency] = useState(1000);
  const [loading, setLoading] = useState(false);
  const createOscillator = function (frequency, rightSide) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // You can change the wave type
    oscillator.frequency.value = frequency; // Set the frequency

    // Create a channel splitter and merger
    const splitter = audioContext.createChannelSplitter(2); // 2 channels (stereo)
    const merger = audioContext.createChannelMerger(2);

    // Connect the oscillator to the splitter and then to the right channel (channel 1)
    oscillator.connect(splitter);
    splitter.connect(merger, 0, rightSide ? 1 : 0); // Connect the right channel
    merger.connect(audioContext.destination);
    return oscillator;
  };

  const playTone = function (e) {
    setLoading(e.target.dataset.side);
    const oscillator = createOscillator(
      frequency,
      e.target.dataset.side === 'right'
    );
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      setLoading(false);
    }, 1000);
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
          onChange={e => setFrequency(e.target.value)}
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
    </>
  );
}

export default App;
