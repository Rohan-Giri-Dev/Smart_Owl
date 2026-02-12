const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for local dev
    methods: ["GET", "POST"]
  }
});
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const Stream = require('node-rtsp-stream');
const cors = require('cors');
const axios = require('axios');

app.use(cors());

const PORT = 3000;

// --- 1. Serial Port Logic ---
const BAUD_RATE = 9600; // Match Arduino code

async function connectToSerial() {
  const ports = await SerialPort.list();
  console.log('Available ports:', ports);

  // 1. Priority: Look for Arduino or common USB-Serial chips
  let arduinoPort = ports.find(p => 
    p.manufacturer && (
      p.manufacturer.includes('Arduino') || 
      p.manufacturer.includes('Silicon Labs') || 
      p.manufacturer.includes('wch.cn')
    )
  );

  // 2. Fallback: Look for "USB" in the path (Linux/macOS style mostly)
  if (!arduinoPort) {
    arduinoPort = ports.find(p => p.path.includes('USB'));
  }

  // 3. Last Resort: Just take the first COM port (Windows) but try to avoid standard ones if possible
  if (!arduinoPort) {
     arduinoPort = ports.find(p => p.path.includes('COM'));
  }

  if (!arduinoPort) {
    console.log('No Arduino found. Waiting...');
    setTimeout(connectToSerial, 3000); // Retry
    return;
  }

  console.log(`Attempting to connect to ${arduinoPort.path}...`);
  const port = new SerialPort({ path: arduinoPort.path, baudRate: BAUD_RATE });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  port.on('open', () => {
    console.log('Serial Port Opened');
  });

  port.on('error', (err) => {
    console.error('Serial Port Error: ', err.message);
    setTimeout(connectToSerial, 3000); // Retry on disconnect
  });

  parser.on('data', (data) => {
    // raw data: "HUM:60.00,TEMP:25.00,MOT:1"
    console.log('Serial Data:', data);
    
    // Parse the data
    const parsed = {};
    try {
        // Detect format: Key-Value (e.g. "HUM:60") or CSV (e.g. "25.00,60.00,1,123")
        // Also handle verbose format: "Data Sent: temp: 33.9  humidity: 36.0..."
        
        // Try Regex for verbose/mixed format first
        const tempMatch = data.match(/temp:\s*([\d.]+)/i) || data.match(/TEMP:([\d.]+)/);
        const humMatch = data.match(/humidity:\s*([\d.]+)/i) || data.match(/HUM:([\d.]+)/);
        const motMatch = data.match(/motion:\s*(\d+)/i) || data.match(/MOT:(\d+)/);
        const gasMatch = data.match(/GAS:\s*(\d+)/i) || data.match(/gas:\s*(\d+)/i);
        const alarmMatch = data.match(/Alaram:\s*(\d+)/i) || data.match(/Alarm:\s*(\d+)/i);

        if (tempMatch || humMatch || motMatch) {
            if (tempMatch) parsed.temp = parseFloat(tempMatch[1]);
            if (humMatch) parsed.humidity = parseFloat(humMatch[1]);
            if (motMatch) parsed.motion = parseInt(motMatch[1]);
            if (gasMatch) parsed.gas = parseInt(gasMatch[1]);
        } else if (data.includes(',')) {
           // CSV Format: Temp, Hum, Motion, Gas (fallback)
           const values = data.trim().split(',');
           if (values.length >= 4 && !isNaN(parseFloat(values[0]))) {
               parsed.temp = parseFloat(values[0]);
               parsed.humidity = parseFloat(values[1]);
               parsed.motion = parseInt(values[2]);
               parsed.gas = parseInt(values[3]);
           }
        }

        // Calibration Offsets (Adjusted based on user report)
        const TEMP_OFFSET = -12.4; 
        
        // Broadcast to frontend
        if (parsed.temp !== undefined) parsed.temp = Number((parsed.temp + TEMP_OFFSET).toFixed(1));
        
        // Ensure values are numbers
        if (parsed.humidity !== undefined) parsed.humidity = Number(parsed.humidity);
        if (parsed.gas !== undefined) parsed.gas = Number(parsed.gas);

        // console.log('Parsed Data:', parsed); // Debug
        io.emit('sensorData', parsed);

        // --- ML Service Integration ---
        // Send data to Python ML service for anomaly detection
        axios.post('http://localhost:5000/data', parsed)
            .then(response => {
                if (response.data && response.data.anomaly) {
                    console.log('Anomaly Detected via ML Service');
                    io.emit('anomalyAlert', { 
                        message: response.data.message || 'Unusual activity detected!', 
                        details: response.data 
                    });
                }
            })
            .catch(err => {
                // Ignore connection refused errors (ML service might be down)
                if (err.code !== 'ECONNREFUSED') {
                    console.error('ML Service Error:', err.message);
                }
            });

        // --- AUTOMATION LOGIC ---
        // Rule: If Humidity > 60 AND Motion detected -> Blower ON ('B')
        // Otherwise -> Blower OFF ('b')
        if (parsed.humidity > 60 && parsed.motion === 1) {
            port.write('B');
            console.log('Auto: Blower ON');
        } else {
            port.write('b'); 
        }

    } catch (e) {
        console.error('Parse Error', e);
    }
  });

  // Listen for frontend connection
  io.on('connection', (socket) => {
      console.log('Frontend connected');
  });
}

connectToSerial();

// --- 2. RTSP Stream Logic ---
// We'll require the RTSP URL from environment or hardcode a default
// For now, we set up a placeholder or expect a specific URL
const RTSP_URL = process.env.RTSP_URL || 'rtsp://user:password@192.168.1.10:554/live1.sdp'; // CHANGE THIS

let stream = null;

function startStream(url) {
    if (stream) {
        stream.stop();
    }
    console.log(`Starting RTSP Stream from ${url}`);
    stream = new Stream({
        name: 'camera_stream',
        streamUrl: url,
        wsPort: 9999, // Port for the video websocket
        ffmpegOptions: { // options ffmpeg flags
            '-stats': '', // an option with no neccessary value uses a blank string
            '-r': 30 // options with required values specify the value after the key
        }
    });
}

// We can expose an API to change the URL
app.get('/start-stream', (req, res) => {
    const { url } = req.query;
    if (url) {
        startStream(url);
        res.send(`Stream started for ${url}`);
    } else {
        res.status(400).send('Missing url parameter');
    }
});

// Start default stream if needed (or wait for UI trigger)
// startStream(RTSP_URL); 

// --- 3. Start Server ---
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.io available on http://localhost:${PORT}`);
  console.log(`Video WebSocket needs to be on port 9999 (handled by node-rtsp-stream)`);
});
