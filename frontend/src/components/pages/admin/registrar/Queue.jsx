import React, { useState, useEffect } from 'react';

const Queue = ({ windowId = 1 }) => {
  // State management for queue operations
  const [selectedWindow, setSelectedWindow] = useState(windowId);

  // Update selected window when windowId prop changes
  useEffect(() => {
    setSelectedWindow(windowId);
  }, [windowId]);
  const [currentServing, setCurrentServing] = useState(15);
  const [queueData, setQueueData] = useState([
    { id: 1, number: 16, status: 'waiting', name: 'Maria Santos', role: 'Student' },
    { id: 2, number: 17, status: 'waiting', name: 'Robert Johnson', role: 'Visitor' },
    { id: 3, number: 18, status: 'waiting', name: 'Ana Rodriguez', role: 'Alumni' },
    { id: 4, number: 19, status: 'waiting', name: 'Michael Chen', role: 'Teacher' },
    { id: 5, number: 20, status: 'waiting', name: 'Sarah Williams', role: 'Student' },
    { id: 6, number: 21, status: 'waiting', name: 'David Brown', role: 'Visitor' },
    { id: 7, number: 22, status: 'waiting', name: 'Lisa Garcia', role: 'Alumni' },
    { id: 8, number: 23, status: 'waiting', name: 'James Wilson', role: 'Student' }
  ]);
  const [skippedQueue, setSkippedQueue] = useState([12, 14]);

  // Mock current serving person data
  const [currentServingPerson, setCurrentServingPerson] = useState({
    name: 'John Doe',
    role: 'Student',
    purpose: 'Enrollment'
  });

  // Mock windows data (this would come from Settings in real implementation)
  const windows = [
    { id: 1, name: 'Window 1', serviceName: 'Enrollment' },
    { id: 2, name: 'Window 2', serviceName: 'Transcript Request' },
    { id: 3, name: 'Window 3', serviceName: 'Certificate Request' }
  ];

  // Queue control handlers
  const handleStop = () => {
    console.log('Queue stopped');
  };

  const handleNext = () => {
    if (queueData.length > 0) {
      const nextInQueue = queueData[0];
      setCurrentServing(nextInQueue.number);
      setCurrentServingPerson({
        name: nextInQueue.name,
        role: nextInQueue.role,
        purpose: 'Enrollment' // Default purpose, could be dynamic in future
      });
      setQueueData(prev => prev.slice(1));
    }
  };

  const handleRecall = () => {
    console.log('Recalling current number:', currentServing);
  };

  const handlePrevious = () => {
    if (currentServing > 1) {
      setCurrentServing(prev => prev - 1);
    }
  };

  const handleTransfer = () => {
    console.log('Transferring current number:', currentServing);
  };

  const handleSkip = () => {
    if (queueData.length > 0) {
      const skippedEntry = queueData[0];
      setSkippedQueue(prev => [...prev, skippedEntry.number]);
      setQueueData(prev => prev.slice(1));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1st Row - Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F3463]">Manage Queueing</h1>
      </div>
      <div className="">
        <h1 className="text-xl font-bold text-[#1F3463]">
          WINDOW {selectedWindow} QUEUE
        </h1>
      </div>

      {/* 2nd Row - Main Control Area */}
      <div className="grid grid-cols-3 gap-6 h-[36rem]">
        {/* Column 1: Current Serving Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-full flex flex-col justify-center space-y-8">
            {/* Row 1: Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1F3463]">Current Serving</h2>
            </div>

            {/* Row 2: Queue Number Display */}
            <div className="text-center space-y-3">
              <p className="text-4xl font-semibold text-gray-700">Queue Number</p>
              <div className="flex justify-center">
                <div className="bg-[#3930A8] text-white rounded-3xl px-[90px] py-[40px] shadow-md">
                  <span className="text-4xl font-bold">
                    {String(currentServing).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: Role */}
            <div className="text-center">
              <p className="text-xl font-bold text-[#1F3463]">{currentServingPerson.role}</p>
            </div>

            {/* Row 4: Name */}
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-gray-700">Name:</p>
              <p className="text-xl font-bold text-[#1F3463]">{currentServingPerson.name}</p>
            </div>

            {/* Row 5: Purpose */}
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-gray-700">Purpose:</p>
              <p className="text-xl font-bold text-[#1F3463]">{currentServingPerson.purpose}</p>
            </div>
          </div>
        </div>

        {/* Column 2: Incoming Queue */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-full flex flex-col">
            {/* First Row: Incoming Header */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-[#1F3463]">Incoming</h3>
            </div>

            {/* Second Row: Scrollable Queue List */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 max-h-[28rem]">
                {queueData.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg shadow-sm"
                  >
                    {/* Column 1: Queue Number Box */}
                    <div className="flex-shrink-0">
                      <div className="bg-[#3930A8] text-white rounded-lg px-4 py-3 text-center min-w-[60px]">
                        <span className="text-lg font-bold">
                          {String(item.number).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Column 2: Person Information */}
                    <div className="flex-1 flex flex-col justify-center space-y-1">
                      {/* Row 1: Name */}
                      <div>
                        <p className="text-lg font-semibold text-[#1F3463] truncate">
                          {item.name}
                        </p>
                      </div>
                      {/* Row 2: Role */}
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show message if no queue entries */}
                {queueData.length === 0 && (
                  <div className="text-center text-gray-500 italic py-8">
                    No incoming queue entries
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Control Buttons */}
        <div className="flex flex-col space-y-4">
          {/* STOP Button - Hollow/Outline Style */}
          <button
            onClick={handleStop}
            className="flex-1 rounded-full border-2 border-[#3930A8] text-[#3930A8] font-bold text-lg hover:bg-[#3930A8] hover:text-white transition-colors duration-200"
          >
            STOP
          </button>

          {/* NEXT Button */}
          <button
            onClick={handleNext}
            className="flex-1 rounded-full bg-[#3930A8] text-white font-bold text-lg hover:bg-[#2F2580] transition-colors duration-200"
          >
            NEXT
          </button>

          {/* RECALL Button */}
          <button
            onClick={handleRecall}
            className="flex-1 rounded-full bg-[#3930A8] text-white font-bold text-lg hover:bg-[#2F2580] transition-colors duration-200"
          >
            RECALL
          </button>

          {/* PREVIOUS Button */}
          <button
            onClick={handlePrevious}
            className="flex-1 rounded-full bg-[#3930A8] text-white font-bold text-lg hover:bg-[#2F2580] transition-colors duration-200"
          >
            PREVIOUS
          </button>

          {/* TRANSFER Button */}
          <button
            onClick={handleTransfer}
            className="flex-1 rounded-full bg-[#3930A8] text-white font-bold text-lg hover:bg-[#2F2580] transition-colors duration-200"
          >
            TRANSFER
          </button>

          {/* SKIP Button */}
          <button
            onClick={handleSkip}
            className="flex-1 rounded-full bg-[#3930A8] text-white font-bold text-lg hover:bg-[#2F2580] transition-colors duration-200"
          >
            SKIP
          </button>
        </div>
      </div>

      {/* 3rd Row - Skipped Queue Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-row items-center gap-6">
          {/* Left Side: Skipped Label */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Skipped</h3>
          </div>

          {/* Right Side: Skipped Queue Numbers */}
          <div className="flex flex-wrap gap-3">
            {skippedQueue.map((number, index) => (
              <div
                key={index}
                className="bg-[#3930A8] text-white rounded-lg px-4 py-2 shadow-md"
              >
                <span className="text-lg font-bold">
                  {String(number).padStart(2, '0')}
                </span>
              </div>
            ))}
            {skippedQueue.length === 0 && (
              <div className="text-gray-500 italic">No skipped queue numbers</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queue;

