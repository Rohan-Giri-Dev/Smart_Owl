import React, { useState } from 'react';
import ParentDashboard from './components/Parent/ParentDashboard';
import KidsPlayground from './components/Kids/KidsPlayground';
import ModeSwitcher from './components/Shared/ModeSwitcher';

function App() {
  const [mode, setMode] = useState('parent'); // 'parent' or 'kid'

  return (
    <div className="relative">
        {mode === 'parent' ? <ParentDashboard /> : <KidsPlayground />}
        
        {/* Global Mode Switcher */}
        <ModeSwitcher currentMode={mode} setMode={setMode} />
    </div>
  );
}

export default App;
