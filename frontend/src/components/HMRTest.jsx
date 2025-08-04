import React, { useState } from 'react';

const HMRTest = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg m-4">
      <h3 className="text-lg font-bold text-yellow-800 mb-2">
        HMR Test Component
      </h3>
      <p className="text-yellow-700 mb-2">
        This component tests Hot Module Replacement. 
        Change this text and save to see if HMR works!
      </p>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Count: {count}
        </button>
        <span className="text-sm text-yellow-600">
          (State should persist during HMR)
        </span>
      </div>
    </div>
  );
};

export default HMRTest;

// HMR compatibility
if (import.meta.hot) {
  import.meta.hot.accept();
}
