import React from 'react';
import SerialMonitor from '../SerialMonitor';
import VoiceControl from '../VoiceControl'; // Re-adding if needed later, or just placeholder for structure
import { ShieldCheck, Wind, Thermometer, Activity } from 'lucide-react';

const StatusCard = ({ icon: Icon, label, value, status, color }) => (
  <div className={`p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg flex items-center justify-between hover:bg-white/10 transition-colors`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
      status === 'Good' || status === 'Normal' ? 'bg-green-500/20 text-green-400' : 
      status === 'Warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
    }`}>
      {status}
    </div>
  </div>
);

const ParentDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 pb-24"> 
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Owl Monitor <span className="text-blue-500">Pro</span>
            </h1>
            <p className="text-slate-400 mt-2">Smart Nursery Monitoring System</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
            </div>
            <span className="text-sm font-medium text-slate-300">System Active</span>
          </div>
        </header>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* These are placeholders, real data comes from SerialMonitor, 
               but strictly this visual component needs to be separate or 
               SerialMonitor needs to be refactored to just provide data context. 
               For now, we'll keep SerialMonitor as the main data view below. */}
           <div className="col-span-full md:col-span-2 lg:col-span-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Everything looks great!</h2>
                <p className="text-blue-100">The environment is stable and comfortable.</p>
              </div>
              <ShieldCheck className="absolute right-8 bottom-[-20px] w-48 h-48 text-white/10 rotate-12" />
           </div>
        </div>

        {/* Extended Data View */}
        <div className="bg-slate-800/30 rounded-3xl border border-slate-700/50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-slate-200">Live Environmental Data</h2>
            </div>
            <SerialMonitor />
        </div>

      </div>
    </div>
  );
};

export default ParentDashboard;
