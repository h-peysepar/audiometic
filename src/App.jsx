import Chart from './Chart.jsx';
import { useState } from 'react';
import {
  CartesianGrid,
  Dot,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
function App() {
  const [line, setLine] = useState(
    Array.from({ length: 7 }).reduce((output, item, i, array) => {
      if (!output.length) {
        return [{ frequency: 125 }];
      }
      const entity = { frequency: output[i - 1].frequency * 2 };
      if (i !== array.length - 1) entity.volume = 40;
      return [...output, entity];
    }, [])
  );
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({ volume: 40, frequency: 1000 });

  const createOscillator = function (frequency, rightSide) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
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
    gainNode.gain.value = Math.pow(10, focused.volume / 20);

    return { oscillator, gainNode };
  };

  const Dot = function (props) {
    if (
      props.payload.frequency === focused.frequency &&
      props.payload.volume === focused.volume
    ) {
      return (
        <svg
          width="14"
          height="14"
          x={props.cx - 7}
          y={props.cy - 7}
          viewBox="0 0 14 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="14" height="14" fill="transparent" />
          <circle cx="7" cy="7" r="5" fill="red" stroke="red" strokeWidth="2" />
        </svg>
      );
    }
    return null;
  };

  const changeVolume = function (e) {
    const treshold = +e.target.dataset.treshold;
    setLine(prev => {
      prev = [...prev];
      const targetIndex = prev.findIndex(
        i => i.frequency === focused.frequency && i.volume === focused.volume
      );
      prev[targetIndex].volume = prev[targetIndex].volume + treshold;
      setFocused(prevv => ({
        ...prevv,
        volume: prevv.volume + treshold,
      }));
      return prev;
    });
  };

  const playTone = function (e) {
    setLoading(e.target.dataset.side);
    const { oscillator } = createOscillator(
      focused.frequency,
      e.target.dataset.side === 'right'
    );
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      setLoading(false);
    }, 1000);
  };

  const changeFrequency = function (e) {
    const treshold = +e.target.dataset.treshold;
    const targetIndex = line.findIndex(
      i => i.frequency === focused.frequency && i.volume === focused.volume
    );
    setFocused({
      volume: line[targetIndex + treshold].volume,
      frequency: line[targetIndex + treshold].frequency,
    });
  };

  return (
    <>
      <h1 className="text-4xl font-bold my-2">Click to play sound</h1>
      <div className="card flex gap-4 my-2 justify-center">
        <button
          className="bg-purple-800 outline-2 outline-red-900 px-4 py-2 rounded-lg w-44 h-12"
          data-treshold="1"
          onClick={changeFrequency}
        >
          Increase Frequency
        </button>
        <button
          className="bg-purple-800 outline-2 outline-red-900 px-4 py-2 rounded-lg w-44 h-12"
          data-treshold="-1"
          onClick={changeFrequency}
        >
          Decrease Frequency
        </button>
      </div>
      <div className="card flex gap-4 my-2 justify-center">
        <button
          className="bg-purple-800 outline-2 outline-red-900 px-4 py-2 rounded-lg w-44 h-12"
          data-side="left"
          onClick={playTone}
        >
          {loading === 'left' ? '...' : 'Play Left Sound'}
        </button>
        <button
          className="bg-purple-800 outline-2 outline-red-900 px-4 py-2 rounded-lg w-44 h-12"
          data-side="right"
          onClick={playTone}
        >
          {loading === 'right' ? '...' : 'Play Right Sound'}
        </button>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={line}
            // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="frequency" />
            <YAxis
              height={1000}
              ticks={Array.from({ length: 11 }).map((_, i) => i * 10)}
            />
            {/* <Tooltip /> */}
            <Legend />
            <Line
              type="linear"
              dataKey="volume"
              stroke="#FF0000"
              dot={<Dot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card flex gap-4 my-2 justify-center">
        <button
          className="bg-purple-800 outline-2 outline-red-900 px-4 py-2 rounded-lg w-44 h-12"
          data-treshold={10}
          onClick={changeVolume}
        >
          I Can't Hear
        </button>
        <button
          className="bg-purple-800 outline-2 outline-red-900 px-4 py-2 rounded-lg w-44 h-12"
          data-treshold={-10}
          onClick={changeVolume}
        >
          I Can Hear
        </button>
      </div>
    </>
  );
}

export default App;
