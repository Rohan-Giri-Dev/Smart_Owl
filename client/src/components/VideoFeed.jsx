import React, { useEffect, useRef } from 'react';
 // We might need to install this or load from script

// Since we didn't install jsmpeg-player via npm (it can be tricky), we'll try to use a script tag or assuming the user has it.
// Actually, let's use a simple JSMpeg approach if possible, or an img tag for MJPEG if the user switches to that.
// For RTSP -> WebSocket (via node-rtsp-stream), we need JSMpeg.

const VideoFeed = () => {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // We need to load JSMpeg. 
    // Ideally we should have `npm install jsmpeg`. 
    // Let's assume we can import it or add it to index.html
    const script = document.createElement('script');
    script.src = 'https://jsmpeg.com/jsmpeg.min.js';
    script.async = true;
    script.onload = () => {
      if (canvasRef.current) {
        playerRef.current = new window.JSMpeg.Player('ws://localhost:9999', {
          canvas: canvasRef.current,
          autoplay: true,
          audio: false, // Cameras usually don't have good audio syncing via this method
          loop: true
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        Live Camera Feed
      </h2>
      <div className="aspect-video bg-black rounded overflow-hidden flex items-center justify-center relative">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
          RTSP Stream
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
