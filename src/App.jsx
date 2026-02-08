import React, { useState, useEffect } from 'react';

// --- 配置常量 ---
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const CIRCUMFERENCE = 534; // 2 * Math.PI * 85

export default function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'break'

  // 1. 核心计时逻辑
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // 播放提示音
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {});
      alert(mode === 'work' ? "Focus Session Done!" : "Break Over!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  // 2. 动态主题配置
  const theme = {
    work: { 
      bg: 'bg-[#E2D7D1]', 
      accent: '#8E9775', 
      glow: 'bg-[#8E9775]',
      label: 'Deep Work'
    },
    break: { 
      bg: 'bg-[#D1D7E2]', 
      accent: '#7A8B99', 
      glow: 'bg-[#7A8B99]',
      label: 'Resting'
    }
  };

  // 3. 辅助计算
  const totalSeconds = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const strokeDashoffset = CIRCUMFERENCE * (1 - timeLeft / totalSeconds);

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
    <div className={`min-h-dvh w-screen flex items-center justify-center ${theme[mode].bg} transition-colors duration-1000 relative overflow-hidden px-4`}>
      
      {/* --- 背景呼吸层 --- */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[100px] opacity-30 transition-all duration-1000 ${theme[mode].glow} ${isActive ? 'animate-breath' : 'scale-90 opacity-10'}`}
      />

      {/* --- 主卡片容器 --- */}
      <div className="bg-white/30 backdrop-blur-3xl p-8 sm:p-12 rounded-[40px] shadow-2xl border border-white/20 w-full max-w-[350px] sm:max-w-md text-center z-10 mx-auto">
        
        {/* 模式切换 */}
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

        {/* --- 核心圆形计时区 --- */}
        <div className="relative flex items-center justify-center mb-12 group">
          
          {/* 冰盘背景层 */}
          <div className={`
            absolute inset-0 rounded-full 
            bg-white/15 backdrop-blur-[12px]
            border border-white/20
            shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]
            transition-all duration-700
            ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-100'}
          `} />

          {/* 进度条 SVG */}
          <svg className="w-64 h-64 sm:w-72 sm:h-72 relative z-10" viewBox="0 0 200 200">
          {/* 背景细环 */}
              <circle cx="100" cy="100" r="85" stroke="#5E5E5E" strokeWidth="1" fill="none" className="opacity-5" />
              {/* 进度环：半径 85 与 viewBox 200 配合，留出了少许呼吸空间 */}
              <circle 
                cx="100" cy="100" r="85" 
                stroke={theme[mode].accent} 
                strokeWidth="6" 
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                style={{ 
                  strokeDashoffset, 
                  transition: 'stroke-dashoffset 1s linear',
                  strokeLinecap: 'round',
                  filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' // 给进度条加点微光
                }}
              />
          </svg>

          {/* 冰刻时间数字 */}
          <div className={`
            absolute flex flex-col items-center justify-center 
            font-mono-numbers z-20 text-[#5E5E5E]
            ${isActive ? 'animate-pulse-subtle' : ''}
          `}>
            <div className="text-6xl sm:text-7xl font-extralight tracking-[-0.05em] flex items-center">
              <span style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>
                {formatTime(timeLeft).split(':')[0]}
              </span>
              <span className={`mx-1 pb-2 font-light transition-opacity duration-1000 ${isActive ? 'opacity-30' : 'opacity-80'}`}>
                :
              </span>
              <span style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>
                {formatTime(timeLeft).split(':')[1]}
              </span>
            </div>
            <div className="text-[10px] tracking-[0.5em] uppercase opacity-40 mt-2 font-semibold">
              {theme[mode].label}
            </div>
          </div>
        </div>

        {/* --- 控制模块 --- */}
        <div className="flex justify-center items-center space-x-10 relative z-20">
          {/* 播放/暂停 */}
          <button 
            onClick={() => setIsActive(!isActive)}
            className="relative group p-6 rounded-full transition-all duration-500 bg-white/20 backdrop-blur-md border border-white/40 shadow-lg hover:bg-white/30 hover:scale-105 active:scale-95"
            style={{ boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.4)' }}
          >
            <div className="relative text-[#5E5E5E]">
              {isActive ? <PauseIcon /> : <PlayIcon />}
            </div>
          </button>
          
          {/* 重置 */}
          <button 
            onClick={() => { setIsActive(false); setTimeLeft(totalSeconds); }}
            className="p-3 rounded-full bg-white/10 backdrop-blur-[4px] border border-white/20 text-[#5E5E5E] opacity-40 hover:opacity-100 hover:rotate-180 transition-all duration-700 active:scale-90"
          >
            <ResetIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 图标组件 ---
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
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);