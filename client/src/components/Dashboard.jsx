import React from 'react';
// import VideoFeed from './VideoFeed';
import SerialMonitor from './SerialMonitor';
// import VoiceControl from './VoiceControl';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Smart Owl Platform
            </h1>
            <p className="text-slate-400 mt-1">Local Unified Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm font-medium text-green-500">System Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Sensors & Controls (Expanded) */}
          <div className="lg:col-span-3 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-semibold mb-2">Device Status</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Connection</span>
                      <span className="text-green-400">USB Serial (COM3)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span>02:14:30</span>
                    </div>
                  </div>
                </div>
             </div>
             
             <SerialMonitor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
