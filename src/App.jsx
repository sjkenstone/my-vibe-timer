import React, { useState, useEffect } from 'react';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const CIRCUMFERENCE = 534;

export default function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {});
      alert(mode === 'work' ? "Focus Session Done!" : "Break Over!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const totalSeconds = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const strokeDashoffset = CIRCUMFERENCE * (1 - timeLeft / totalSeconds);
  
  // 颜色映射
  const theme = {
    work: { bg: 'bg-[#E2D7D1]', accent: '#8E9775', glow: 'bg-[#8E9775]' },
    break: { bg: 'bg-[#D1D7E2]', accent: '#7A8B99', glow: 'bg-[#7A8B99]' }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  return (
    // 主容器：层级设定为 relative 和 overflow-hidden 确保呼吸层不会溢出
    <div className={`min-h-screen flex items-center justify-center ${theme[mode].bg} transition-colors duration-1000 relative overflow-hidden`}>
      
      {/* --- 呼吸层开始 --- */}
      {/* 这是一个位于背后的模糊大圆球，当 isActive 为真时，开启 animate-breath */}
      <div 
        className={`absolute w-[150%] h-[150%] rounded-full blur-[120px] opacity-30 transition-all duration-1000 ${theme[mode].glow} ${isActive ? 'animate-breath' : 'scale-90 opacity-10'}`}
      />
      {/* --- 呼吸层结束 --- */}

      <div className="bg-white/30 backdrop-blur-3xl p-12 rounded-[50px] shadow-2xl border border-white/20 w-96 text-center z-10">
        
        {/* 模式选择 */}
        <div className="flex justify-center space-x-8 mb-10">
          {['work', 'break'].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`text-xs tracking-[0.2em] uppercase transition-all ${
                mode === m ? 'font-bold text-[#5E5E5E] opacity-100' : 'text-[#5E5E5E] opacity-40 hover:opacity-70'
              }`}
            >
              {m === 'work' ? 'Focus' : 'Relax'}
            </button>
          ))}
        </div>

        {/* 进度条 */}
        <div className="relative flex items-center justify-center mb-12">
          <svg className="transform -rotate-90 w-72 h-72" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="85" stroke="#5E5E5E" strokeWidth="1" fill="none" className="opacity-10" />
            <circle 
              cx="100" cy="100" r="85" 
              stroke={theme[mode].accent} 
              strokeWidth="5" fill="none"
              strokeDasharray={CIRCUMFERENCE}
              style={{ 
                strokeDashoffset, 
                transition: 'stroke-dashoffset 1s linear',
                strokeLinecap: 'round'
              }}
            />
          </svg>
          <div className="absolute text-6xl font-extralight tracking-tighter text-[#5E5E5E]">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* 控制 */}
        <div className="flex justify-center items-center space-x-10">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="bg-white/60 p-5 rounded-full hover:bg-white/90 transition-all active:scale-90 shadow-sm text-[#5E5E5E]"
          >
            {isActive ? <PauseIcon /> : <PlayIcon />}
          </button>
          
          <button 
            onClick={() => { setIsActive(false); setTimeLeft(totalSeconds); }}
            className="text-[#5E5E5E] opacity-40 hover:opacity-100 hover:rotate-180 transition-all duration-700"
          >
            <ResetIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// 图标组件 (保持不变)
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
  </svg>
);
const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M10 9v6m4-6v6" />
  </svg>
);
const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);