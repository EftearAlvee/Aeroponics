'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database } from '@/firebase/config';
import LiveStream from '@/components/LiveStream';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    temperature: 0,
    humidity: 0,
    pH: 0,
    waterLevel: 0,
  });

  const [controls, setControls] = useState({
    tempRange: 0,
    phRange: 0,
    pumpCycle: { onFor: 0, offFor: 0 },
    nutrientPumpRunningTime: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data from Firebase
  useEffect(() => {
    const metricsRef = ref(database, 'metrics');
    const controlsRef = ref(database, 'systemControls');

    // Listen for metrics updates
    const metricsUnsubscribe = onValue(metricsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMetrics(data);
      }
    });

    // Listen for controls updates
    const controlsUnsubscribe = onValue(controlsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setControls(data);
      }
      setIsLoading(false);
    });

    // Cleanup listeners
    return () => {
      metricsUnsubscribe();
      controlsUnsubscribe();
    };
  }, []);

  // Handle control changes
  const handleControlChange = (category, field, value) => {
    setControls(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: Number(value)
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading Information...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {activeTab === 'dashboard' && 'Aeroponics Dashboard'}
            {activeTab === 'controls' && 'System Controls'}
          </h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-center space-x-1 mb-6 bg-white rounded-lg p-1 shadow w-fit mx-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('controls')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'controls'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              System Controls
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
              <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Temperature Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Temperature</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.temperature}°C</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-red-100 rounded">
                    <div 
                      className="h-2 bg-red-500 rounded" 
                      style={{ width: `${(metrics.temperature / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Humidity Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Humidity</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.humidity}%</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 15c0 3.866-3.582 7-8 7s-8-3.134-8-7c0-2.57 2.086-4.79 5.115-6.036C9.242 7.38 10.486 6 12 6c1.514 0 2.758 1.38 2.885 3.964C17.914 10.21 20 12.43 20 15z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-blue-100 rounded">
                    <div 
                      className="h-2 bg-blue-500 rounded" 
                      style={{ width: `${metrics.humidity}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* pH Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">pH Level</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.pH}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-green-100 rounded">
                    <div 
                      className="h-2 bg-green-500 rounded" 
                      style={{ width: `${(metrics.pH / 14) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Water Level Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Water Level</p>
                    <p className="text-2xl font-semibold text-gray-900">{metrics.waterLevel}%</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-purple-100 rounded">
                    <div 
                      className="h-2 bg-purple-500 rounded" 
                      style={{ width: `${metrics.waterLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <LiveStream />
            </>
          )}

          {activeTab === 'controls' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">System Controls</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Temperature Range */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Target Temperature (°C)</label>
                  <input
                    type="number"
                    value={controls.tempRange}
                    onChange={(e) => setControls(prev => ({
                      ...prev,
                      tempRange: Number(e.target.value)
                    }))}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black placeholder-gray-400"
                    placeholder="Temperature"
                  />
                </div>

                {/* pH Range */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Target pH Level</label>
                  <input
                    type="number"
                    value={controls.phRange}
                    onChange={(e) => setControls(prev => ({
                      ...prev,
                      phRange: Number(e.target.value)
                    }))}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black placeholder-gray-400"
                    placeholder="pH Level"
                  />
                </div>

                {/* Pump Cycle */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Misting Pump Cycle</label>
                  <div className="flex gap-3">
                    <select
                      value={controls.pumpCycle.onFor}
                      onChange={(e) => handleControlChange('pumpCycle', 'onFor', e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black placeholder-gray-400"
                    >
                      <option value="">Select On Time</option>
                      <option value="5">5 seconds</option>
                      <option value="10">10 seconds</option>
                      <option value="15">15 seconds</option>
                      <option value="20">20 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="120">2 minutes</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="900">15 minutes</option>
                      <option value="1200">20 minutes</option>
                      <option value="1800">30 minutes</option>
                      <option value="2700">45 minutes</option>
                    </select>
                    <select
                      value={controls.pumpCycle.offFor}
                      onChange={(e) => handleControlChange('pumpCycle', 'offFor', e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black placeholder-gray-400"
                    >
                      <option value="">Select Off Time</option>
                      <option value="5">5 seconds</option>
                      <option value="10">10 seconds</option>
                      <option value="15">15 seconds</option>
                      <option value="20">20 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="120">2 minutes</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                      <option value="900">15 minutes</option>
                      <option value="1200">20 minutes</option>
                      <option value="1800">30 minutes</option>
                      <option value="2700">45 minutes</option>
                    </select>
                  </div>
                </div>

                {/* Nutrient Pump Range */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Nutrient Pump Range (Time)</label>
                  <div>
                    <input
                      type="number"
                      value={controls.nutrientPumpRunningTime}
                      onChange={(e) => setControls(prev => ({
                        ...prev,
                        nutrientPumpRunningTime: Number(e.target.value)
                      }))}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black placeholder-gray-400"
                      placeholder="Running Time"
                    />
                    <small className="text-gray-500">Running Time</small>
                  </div>
                </div>
              </div>
              
              {/* Add submit button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      const controlsRef = ref(database, 'systemControls');
                      await set(controlsRef, controls);
                      alert('Settings saved successfully!');
                    } catch (error) {
                      console.error('Error saving settings:', error);
                      alert('Error saving settings. Please try again.');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 