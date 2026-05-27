import { useState, useEffect } from 'react';
import { ShieldCheck, HardDriveDownload, HardDriveUpload, Power, ChevronDown, RefreshCw, Minus, Square, X, RefreshCcw } from 'lucide-react';

interface TitleBarProps {
  engineActive: boolean;
  setEngineActive: (active: boolean) => void;
  balance: number;
  onRefreshStats: () => void;
  networkLatency: number;
  onShowToast: (message: string, type: 'info' | 'success' | 'warning') => void;
}

export default function TitleBar({
  engineActive,
  setEngineActive,
  balance,
  onRefreshStats,
  networkLatency,
  onShowToast
}: TitleBarProps) {
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);

  // Simulate active bandwidth noise when engine is active
  useEffect(() => {
    if (!engineActive) {
      setDownloadSpeed(0);
      setUploadSpeed(0);
      return;
    }

    const interval = setInterval(() => {
      setDownloadSpeed(Math.floor(Math.random() * 45) + 5);
      setUploadSpeed(Math.floor(Math.random() * 8) + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, [engineActive]);

  const handleWindowAction = (action: string) => {
    if (action === 'minimize') {
      onShowToast('9Router minimized to System Tray background task.', 'info');
    } else if (action === 'maximize') {
      onShowToast('Desktop GUI boundary fitted to default workspace size.', 'info');
    } else if (action === 'close') {
      onShowToast('Shutdown requested. Saving Active Port Forward Tables.', 'warning');
    }
  };

  return (
    <div className="flex h-12 bg-slate-955 border-b border-slate-800 select-none items-center justify-between px-4 text-xs font-medium text-slate-300">
      {/* App Brand & Window Dots */}
      <div className="flex items-center space-x-3">
        {/* Interactive Window Controls (Simulating MacOS client style) */}
        <div className="flex space-x-1.5 mr-2">
          <button 
            onClick={() => handleWindowAction('close')}
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center group focus:outline-none"
            title="Close"
          >
            <X className="w-1.5 h-1.5 opacity-0 group-hover:opacity-100 text-red-950 stroke-[3]" />
          </button>
          <button 
            onClick={() => handleWindowAction('minimize')}
            className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 flex items-center justify-center group focus:outline-none"
            title="Minimize"
          >
            <Minus className="w-1.5 h-1.5 opacity-0 group-hover:opacity-100 text-yellow-950 stroke-[3]" />
          </button>
          <button 
            onClick={() => handleWindowAction('maximize')}
            className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 flex items-center justify-center group focus:outline-none"
            title="Maximize"
          >
            <Square className="w-1 h-1 opacity-0 group-hover:opacity-100 text-green-950 " />
          </button>
        </div>

        {/* 9Router Icon Design */}
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded bg-indigo-600/20 border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <span className="font-bold tracking-wider text-white">9Router</span>
          <span className="text-[10px] bg-indigo-550/40 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 font-mono">v1.4.2</span>
        </div>
      </div>

      {/* Real-time Network Streams (Middle section) */}
      <div className="hidden md:flex items-center space-x-6 font-mono text-[11px]">
        {engineActive ? (
          <>
            <div className="flex items-center text-emerald-400 space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400 text-[10px]">ROUTING SYSTEM:</span>
              <span>ONLINE</span>
            </div>

            <div className="flex items-center space-x-3 text-slate-400 px-3 py-1 bg-slate-900/60 rounded border border-slate-800">
              <div className="flex items-center space-x-1">
                <HardDriveDownload className="w-3 h-3 text-indigo-400" />
                <span className="text-white font-semibold">{downloadSpeed}.4</span>
                <span className="text-[9px] text-slate-500">M/s</span>
              </div>
              <div className="h-3 w-px bg-slate-850"></div>
              <div className="flex items-center space-x-1">
                <HardDriveUpload className="w-3 h-3 text-violet-400" />
                <span className="text-white font-semibold">{uploadSpeed}.1</span>
                <span className="text-[9px] text-slate-500">M/s</span>
              </div>
              <div className="h-3 w-px bg-slate-850"></div>
              <div className="text-[10px]">
                <span>PING: </span>
                <span className="text-emerald-400 font-bold">{networkLatency} ms</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center text-slate-500 space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span>SYSTEM ENGINES ARE PAUSED / LOCAL ONLY</span>
          </div>
        )}
      </div>

      {/* Balance Pill, Service Toggle */}
      <div className="flex items-center space-x-3">
        {/* Token Balance Tracker */}
        <div 
          onClick={onRefreshStats}
          className="flex items-center space-x-2 bg-indigo-950/40 border border-indigo-550/35 px-2.5 py-1 rounded cursor-pointer hover:bg-indigo-900/40 transition group"
          title="Click to check IP pool balances"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-110"></div>
          <span className="text-[10px] text-indigo-300">BALANCE:</span>
          <span className="font-bold text-white font-mono">{balance.toLocaleString()} IP</span>
          <RefreshCw className="w-2.5 h-2.5 text-indigo-400 ml-1 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition duration-500" />
        </div>

        {/* Engine Power Switch */}
        <button
          onClick={() => {
            setEngineActive(!engineActive);
            onShowToast(
              engineActive 
                ? 'SOCKS5 Proxy client engine stopped. Local routes disabled.' 
                : 'SOCKS5 routing active. Direct port-loops running.',
              engineActive ? 'warning' : 'success'
            );
          }}
          className={`relative overflow-hidden flex items-center space-x-1.5 rounded px-3 py-1 text-[11px] font-bold tracking-normal transition-all duration-300 border shadow ${
            engineActive
              ? 'bg-emerald-600/20 hover:bg-emerald-600/35 border-emerald-500 text-emerald-400'
              : 'bg-rose-950/20 hover:bg-rose-900/30 border-rose-500/50 text-rose-400'
          }`}
        >
          <Power className={`w-3.5 h-3.5 ${engineActive ? 'animate-pulse text-emerald-400' : 'text-rose-400'}`} />
          <span>{engineActive ? 'ROUTER ENG: ON' : 'ROUTER ENG: OFF'}</span>
        </button>
      </div>
    </div>
  );
}
