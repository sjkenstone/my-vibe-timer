import React, { useState, useEffect } from 'react';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const CIRCUMFERENCE = 534;

export default function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');

  useEffect(() => {
  // 根据模式动态改变手机状态栏颜色
  const metaColor = document.querySelector('meta[name="theme-color"]');
  const color = mode === 'work' ? '#E2D7D1' : '#D1D7E2';
  
  if (metaColor) {
    metaColor.setAttribute('content', color);
  } else {
    const meta = document.createElement('meta');
    meta.name = "theme-color";
    meta.content = color;
    document.head.appendChild(meta);
  }
}, [mode]);

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
    <div className={`min-h-dvh w-screen flex items-center justify-center ${theme[mode].bg} transition-colors duration-1000 relative overflow-hidden px-4`}>
      
      {/* --- 呼吸层开始 --- */}
      {/* 这是一个位于背后的模糊大圆球，当 isActive 为真时，开启 animate-breath */}
      <div 
    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[100px] opacity-30 transition-all duration-1000 ${theme[mode].glow} ${isActive ? 'animate-breath' : 'scale-90 opacity-10'}`}
  />
      {/* --- 呼吸层结束 --- */}

      <div className="bg-white/30 backdrop-blur-3xl p-8 sm:p-12 rounded-[40px] shadow-2xl border border-white/20 w-full max-w-[340px] sm:max-w-md text-center z-10 mx-auto">
        
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
        <div className="relative flex items-center justify-center mb-8 scale-90 sm:scale-100">
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
          {/* 圆形进度条中间的时间文字 */}
{/* 圆形进度条中间的时间文字 - 冰刻升级版 */}
<div className={`
  absolute flex flex-col items-center justify-center 
  font-mono-numbers z-20 
  ${isActive ? 'animate-pulse-subtle' : ''}
`}>
  
  {/* 时间主体：冰刻核心层 */}
  <div className="
    relative
    text-7xl font-extralight tracking-[-0.05em] 
    flex items-center 
    text-white/80 
    backdrop-blur-[2px] 
    px-4 py-2 rounded-2xl
  ">
    {/* 文字的光影折射：利用 text-shadow 模拟冰面边缘光 */}
    <span style={{ 
      textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.05)' 
    }}>
      {formatTime(timeLeft).split(':')[0]}
    </span>
    
    <span className={`mx-1 pb-2 font-light transition-opacity duration-1000 ${isActive ? 'opacity-30' : 'opacity-80'}`}>
      :
    </span>
    
    <span style={{ 
      textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.05)' 
    }}>
      {formatTime(timeLeft).split(':')[1]}
    </span>
  </div>

  {/* 状态标签：保持极简感 */}
  <div className="text-[10px] tracking-[0.5em] uppercase text-morandi-ink opacity-30 mt-4 font-semibold">
    {mode === 'work' ? 'Deep Work' : 'Resting'}
  </div>
</div>
        </div>

{/* 控制模块 - 冰刻升级版 */}
<div className="flex justify-center items-center space-x-12 relative z-20">
  
  {/* 开始/暂停按钮：主冰块 */}
  <button 
    onClick={() => setIsActive(!isActive)}
    className={`
      relative group
      p-6 rounded-full 
      transition-all duration-500 ease-out
      bg-white/20 backdrop-blur-md
      border border-white/40
      shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
      hover:bg-white/30 hover:scale-105 active:scale-95
    `}
    style={{
      boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.4)' // 内部冰裂纹理感
    }}
  >
    {/* 按钮光效背景 */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative text-morandi-ink">
      {isActive ? <PauseIcon /> : <PlayIcon />}
    </div>
  </button>
  
  {/* 重置按钮：次级冰块 */}
  <button 
    onClick={() => { setIsActive(false); setTimeLeft(totalSeconds); }}
    className={`
      p-3 rounded-full
      bg-white/10 backdrop-blur-[4px]
      border border-white/20
      text-morandi-ink opacity-40 
      hover:opacity-100 hover:rotate-180 
      transition-all duration-700
      active:scale-90
    `}
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
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);