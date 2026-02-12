import React, { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, Activity, AlertTriangle, X } from 'lucide-react';

const SensorCard = ({ title, value, unit, icon: Icon, color }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-400 font-medium">{title}</h3>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-4xl font-bold text-white">{value}</span>
      <span className="text-slate-500">{unit}</span>
    </div>
  </div>
);

const SerialMonitor = () => {
  const [data, setData] = useState({
    temp: 0,
    humidity: 0,
    gas: 0,
    motion: 0,
    alarm: 0
  });

  const [anomaly, setAnomaly] = useState(null); // { message: string, details: object }

  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on('sensorData', (rawData) => {
      // Expecting format like "H:60,T:25,M:1,G:400" or JSON
      // Let's try to parse both
      let parsed = {};
      
      console.log("Raw:", rawData);

      try {
        if (typeof rawData === 'string' && rawData.startsWith('{')) {
           parsed = JSON.parse(rawData);
        } else if (typeof rawData === 'string') {
           // Basic parser for "key:value,key:value"
           rawData.split(',').forEach(pair => {
             const [key, val] = pair.split(':');
             if (key === 'T') parsed.temp = parseFloat(val);
             if (key === 'H') parsed.humidity = parseFloat(val);
             if (key === 'M') parsed.motion = parseInt(val);
             if (key === 'G') parsed.gas = parseInt(val);
             if (key === 'A') parsed.alarm = parseInt(val);
           });
        } else {
             parsed = rawData; // Already JSON object
        }
        
        setData(prev => ({ ...prev, ...parsed }));
        
        setHistory(prev => {
            const now = new Date().toLocaleTimeString();
            // Only add to history if we have valid numbers
            if (typeof parsed.temp === 'number' && typeof parsed.humidity === 'number') {
                const entry = { 
                    time: now, 
                    temp: parsed.temp, 
                    humidity: parsed.humidity 
                };
                const newHistory = [...prev, entry];
                if (newHistory.length > 20) newHistory.shift();
                return newHistory;
            }
            return prev;
        });

      } catch (e) {
        console.error("Error parsing sensor data", e);
      }
    });

    socket.on('anomalyAlert', (alert) => {
      setAnomaly(alert);
      // Auto-dismiss after 5 seconds
      setTimeout(() => setAnomaly(null), 5000);
    });

    return () => {
      socket.off('sensorData');
      socket.off('anomalyAlert');
    };
  }, []);

  return (
    <div className="space-y-6">
      {anomaly && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="text-red-200 font-bold">Anomaly Detected!</h3>
              <p className="text-red-300 text-sm">{anomaly.message}</p>
            </div>
          </div>
          <button onClick={() => setAnomaly(null)} className="text-red-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard 
          title="Temperature" 
          value={data.temp} 
          unit="°C" 
          icon={Thermometer} 
          color="text-orange-500" 
        />
        <SensorCard 
          title="Humidity" 
          value={data.humidity} 
          unit="%" 
          icon={Droplets} 
          color="text-blue-500" 
        />
        <SensorCard 
          title="Gas Level" 
          value={data.gas} 
          unit="Raw" 
          icon={Wind} 
          color="text-green-500" 
        />
         <SensorCard 
          title="Motion" 
          value={data.motion ? "DETECTED" : "Clear"} 
          unit="" 
          icon={Activity} 
          color={data.motion ? "text-red-500" : "text-slate-500"} 
        />
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-slate-100 font-semibold mb-6">Real-time Environmental Data</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area type="monotone" dataKey="temp" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" />
              <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHum)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SerialMonitor;
