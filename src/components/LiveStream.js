'use client';

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebase/config';

export default function LiveStream() {
  const [streamData, setStreamData] = useState({
    image: ''
  });

  useEffect(() => {
    const streamRef = ref(database, 'stream');
    
    const unsubscribe = onValue(streamRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStreamData({
          image: data
        });
      } else {
        setStreamData({
          image: ''
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Stream</h2>
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden min-h-[300px] max-h-[600px] relative">
        {streamData.image ? (
          <img 
            src={`data:image/jpeg;base64,${streamData.image}`}
            alt="Plant growth live stream"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <svg 
              className="w-16 h-16 text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">Stream Offline</p>
            <p className="text-gray-400 text-sm">Please check your camera connection</p>
          </div>
        )}
        
        {/* Status Indicator */}
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full flex items-center ${
          streamData.image ? 'bg-red-500' : 'bg-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            streamData.image ? 'bg-white animate-pulse' : 'bg-gray-300'
          }`}></div>
          <span className="text-white text-sm">
            {streamData.image ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </div>
  );
} 