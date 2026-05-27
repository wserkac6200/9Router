import { useState, useMemo, useEffect, useRef } from 'react';
import { ScrollText, Trash2, Download, Play, Pause, Search, Terminal, AlertTriangle } from 'lucide-react';
import { LogEntry } from '../types';

interface LogsViewProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onShowToast: (message: string, type: 'info' | 'success' | 'warning') => void;
}

export default function LogsView({
  logs,
  onClearLogs,
  onShowToast
}: LogsViewProps) {
  const [logSearch, setLogSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [pauseScroll, setPauseScroll] = useState(false);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic depending on toggle state
  useEffect(() => {
    if (pauseScroll) return;
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, pauseScroll]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Free text search
      if (logSearch && !log.message.toLowerCase().includes(logSearch.toLowerCase())) return false;
      // Source categorization
      if (sourceFilter !== 'ALL' && log.source !== sourceFilter) return false;
      // Level categorization
      if (levelFilter !== 'ALL' && log.type !== levelFilter) return false;

      return true;
    });
  }, [logs, logSearch, sourceFilter, levelFilter]);

  const handleExportLogs = () => {
    onShowToast('Building security payload... Exported log bundle to local drive.', 'success');
  };

  return (
    <div className="space-y-4 font-sans animate-fade-in text-slate-200">
      
      {/* Top action header info */}
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>SOCKS5 Daemon Session stdout logs</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Observe real-time telemetry and active secure routing handshakes running inside the client sandbox virtual threads.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Pause Scroll toggle */}
          <button
            onClick={() => setPauseScroll(!pauseScroll)}
            className={`flex items-center space-x-1 border font-bold text-xs px-3 py-1.5 rounded-md transition ${
              pauseScroll 
                ? 'bg-amber-950/20 border-amber-500/30 text-amber-400' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-755'
            }`}
          >
            {pauseScroll ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{pauseScroll ? 'Resume Scroll' : 'Freeze Scroll'}</span>
          </button>

          {/* Export logs */}
          <button
            onClick={handleExportLogs}
            className="flex items-center space-x-1 bg-slate-800 border border-slate-700 hover:bg-slate-755 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Dump Log (.log)</span>
          </button>

          {/* Clear Logs */}
          <button
            onClick={onClearLogs}
            className="flex items-center space-x-1 bg-red-955/20 border border-red-900/30 text-red-400 hover:bg-red-950/30 font-bold text-xs px-3 py-1.5 rounded-md transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Flush Logs</span>
          </button>

        </div>
      </div>

      {/* Filter and Search parameters row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Search Input bar */}
        <div className="md:col-span-4 relative">
          <input
            type="text"
            placeholder="Search stdout messages string..."
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-505 font-mono"
          />
          <Search className="w-3.5 h-3.5 text-slate-550 absolute left-2.5 top-2.5" />
        </div>

        {/* Source Categories Select */}
        <div className="md:col-span-4 flex items-center space-x-2 text-xs">
          <span className="text-slate-500 shrink-0 uppercase-subtle font-bold text-[10px]">Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-505 font-medium"
          >
            <option value="ALL">All Sources (ENGINE / PORTS / API / USER)</option>
            <option value="ENGINE">ENGINE (Core daemon status)</option>
            <option value="PORT">PORT (Tunnel map bounds)</option>
            <option value="API">API (Endpoints requests)</option>
            <option value="USER">USER (Client dashboard action)</option>
            <option value="SECURITY">SECURITY (Token / IP Checks)</option>
          </select>
        </div>

        {/* Severity levels Selector */}
        <div className="md:col-span-4 flex items-center space-x-2 text-xs">
          <span className="text-slate-500 shrink-0 uppercase-subtle font-bold text-[10px]">Severity:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-505 font-medium"
          >
            <option value="ALL">All Severity Levels</option>
            <option value="info">INFO (Standard logs)</option>
            <option value="success">SUCCESS (Active bounds)</option>
            <option value="warning">WARNING (Mapping releases)</option>
            <option value="error">ERROR (System exceptions)</option>
          </select>
        </div>

      </div>

      {/* Monospace terminal console viewport */}
      <div className="bg-slate-955 rounded-xl border border-slate-900 overflow-hidden shadow-inner flex flex-col h-96 relative">
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-900/80 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">serkac100@router-client-vmstdout:~</span>
          </div>
          <span className="text-[9px] text-slate-650 font-mono">ENCODING:UTF-8</span>
        </div>

        {/* Terminal viewport inner scrollbox */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono text-[11px] leading-relaxed select-all">
          
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              
              // Color map selectors based on severity logger level
              const colorClass = 
                log.type === 'success' 
                  ? 'text-emerald-400' 
                  : log.type === 'warning' 
                    ? 'text-amber-400' 
                    : log.type === 'error' 
                      ? 'text-rose-400' 
                      : 'text-indigo-305';

              return (
                <div key={log.id} className="flex items-start border-b border-slate-950/20 pb-1 hover:bg-slate-900/20 px-1 rounded transition duration-150">
                  {/* Timestamp code */}
                  <span className="text-slate-505 select-none mr-2.5 font-semibold text-[10px] shrink-0">
                    [{log.timestamp}]
                  </span>
                  {/* Source classification badge */}
                  <span className="text-[#a5b4fc] font-bold select-none mr-2 size-12 font-mono uppercase text-[9px] tracking-tight bg-indigo-950/60 p-0.5 border border-indigo-900/30 rounded text-center shrink-0">
                    {log.source}
                  </span>
                  {/* Core log text */}
                  <span className={colorClass}>
                    {log.message}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center text-slate-600 select-none pb-8 select-none">
              <ScrollText className="w-8 h-8 text-slate-800 mb-2 animate-pulse" />
              <span>stdout console is completely blank</span>
              <p className="text-[10px] text-slate-750 max-w-sm mt-1">
                Logs matching query parameters are missing. Clear search query terms or trigger proxy engine handshakes.
              </p>
            </div>
          )}

          <div ref={consoleEndRef} />
        </div>
      </div>

    </div>
  );
}
