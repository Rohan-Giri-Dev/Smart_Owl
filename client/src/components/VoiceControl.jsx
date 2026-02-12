import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { socket } from '../services/socket';

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setResponse("Browser not supported (use Chrome).");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase().trim();
      setTranscript(command);
      console.log("Voice Command:", command);

      processCommand(command);
    };

    if (isListening) {
        recognition.start();
    } else {
        recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening]);

  const processCommand = (cmd) => {
    if (cmd.includes('owl')) {
        // Simple wake word logic or just contextual commands
        if (cmd.includes('check air') || cmd.includes('status')) {
            // We can't easily get the *latest* data here without context, 
            // but we can ask the user to look at the screen or speak a generic message.
            speak("Checking air quality. Please see the dashboard.");
            setResponse("Checking air...");
        } else if (cmd.includes('stop blower') || cmd.includes('turn off blower')) {
            socket.emit('controlBlower', false);
            speak("Stopping the blower.");
            setResponse("Blower stopped (Manual Mode).");
        } else if (cmd.includes('start blower') || cmd.includes('turn on blower')) {
            socket.emit('controlBlower', true);
            speak("Starting the blower.");
            setResponse("Blower started (Manual Mode).");
        } else if (cmd.includes('auto mode') || cmd.includes('automatic') || cmd.includes('resume')) {
            socket.emit('autoMode');
            speak("Resuming automatic mode.");
            setResponse("Auto Mode Resumed.");
        }
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const toggleListening = () => setIsListening(!isListening);

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex items-center justify-between">
      <div>
        <h3 className="text-slate-100 font-medium mb-1">Voice Control</h3>
        <p className="text-xs text-slate-400">Try saying: "Owl, stop blower"</p>
        {transcript && <p className="text-xs text-blue-400 mt-2">Heard: "{transcript}"</p>}
        {response && <p className="text-xs text-green-400">Response: "{response}"</p>}
      </div>
      
      <button 
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all ${
          isListening 
            ? 'bg-red-500/20 text-red-500 animate-pulse ring-2 ring-red-500/50' 
            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
        }`}
      >
        {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default VoiceControl;
