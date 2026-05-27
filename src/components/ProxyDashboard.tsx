import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Settings2, 
  RefreshCcw, 
  ArrowUpRight, 
  Network, 
  Users, 
  CircleDot, 
  Cpu, 
  Coins,
  Globe2
} from 'lucide-react';
import { ProxyItem, ForwardedPort, UserStats } from '../types';

interface ProxyDashboardProps {
  proxies: ProxyItem[];
  ports: ForwardedPort[];
  userStats: UserStats;
  engineActive: boolean;
  setEngineActive: (active: boolean) => void;
  onNavigate: (tab: 'dashboard' | 'proxies' | 'ports' | 'api' | 'cdk' | 'map' | 'logs' | 'settings') => void;
  onRefreshStats: () => void;
}

export default function ProxyDashboard({
  proxies,
  ports,
  userStats,
  engineActive,
  setEngineActive,
  onNavigate,
  onRefreshStats
}: ProxyDashboardProps) {
  const [trafficCounter, setTrafficCounter] = useState({ sent: 142.4, recv: 894.2 });

  // Simulate light telemetry update of total traffic bytes when engine is online
  useEffect(() => {
    if (!engineActive) return;
    const interval = setInterval(() => {
      setTrafficCounter(prev => ({
        sent: Number((prev.sent + Math.random() * 0.9).toFixed(1)),
        recv: Number((prev.recv + Math.random() * 2.8).toFixed(1))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [engineActive]);

  const activeForwardingCount = ports.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upper Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/40 p-5 rounded-lg border border-slate-800/80 gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">System Routing Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Manage clean residential IP forward loops, proxy nodes, and active local bypass chains.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={onRefreshStats}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-755 text-slate-200 text-xs px-3 py-2 rounded-md font-bold transition border border-slate-700/60"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Flush DNS & Refresh Pool</span>
          </button>
          
          <button
            onClick={() => setEngineActive(!engineActive)}
            className={`text-xs px-4 py-2 rounded-md font-bold tracking-wide transition border shadow-lg ${
              engineActive 
                ? 'bg-emerald-600/20 hover:bg-emerald-600/35 border-emerald-500 text-emerald-400 shadow-emerald-950/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-505 shadow-indigo-950/30'
            }`}
          >
            {engineActive ? 'Suspend SOCKS5 Daemon' : 'Initiate SOCKS5 Daemon'}
          </button>
        </div>
      </div>

      {/* Grid of 4 Key Indicators card layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1: Balance IP */}
        <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition">
            <Coins className="w-8 h-8 text-indigo-400" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase font-mono">AVAILABLE IP POOL CAPS</span>
          <div className="text-2xl font-black text-white mt-1 font-mono tracking-wide">{userStats.balance}</div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Query limit: UNRESTRICTED</span>
            <span className="text-indigo-400 font-bold hover:underline cursor-pointer" onClick={() => onNavigate('dashboard')}>Buy More</span>
          </div>
          <div className="h-1 bg-indigo-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '74%' }}></div>
          </div>
        </div>

        {/* Metric Card 2: Active Maps */}
        <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition">
            <Network className="w-8 h-8 text-emerald-400" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase font-mono">PORT FORWARD LOOPS</span>
          <div className="text-2xl font-black text-white mt-1 font-mono tracking-wide">
            {activeForwardingCount} <span className="text-xs text-slate-400 font-normal">Active Ports</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Local Proxy Loopback</span>
            <span className="text-emerald-400 font-bold hover:underline cursor-pointer" onClick={() => onNavigate('ports')}>View Ports &rarr;</span>
          </div>
          <div className="h-1 bg-emerald-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: activeForwardingCount > 0 ? '45%' : '0%' }}></div>
          </div>
        </div>

        {/* Metric Card 3: Traffic Stats */}
        <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition">
            <Activity className="w-8 h-8 text-sky-400" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase font-mono font-mono">ROUTE DATA STATS</span>
          <div className="text-2xl font-black text-white mt-1 font-mono tracking-wide">
            {trafficCounter.recv} <span className="text-xs text-slate-400 font-normal">MB Recv</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Sent: {trafficCounter.sent} MB</span>
            <span className="text-slate-500 font-bold">Local Loop Only</span>
          </div>
          <div className="h-1 bg-sky-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: '58%' }}></div>
          </div>
        </div>

        {/* Metric Card 4: Global Pool Coverage */}
        <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition">
            <Globe2 className="w-8 h-8 text-teal-400" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-teal-400 uppercase font-mono font-mono">IP POOL COVERAGE</span>
          <div className="text-2xl font-black text-white mt-1 font-mono tracking-wide">
            {proxies.length} <span className="text-xs text-slate-400 font-normal">Active Nodes</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Global countries: 12</span>
            <span className="text-teal-400 font-bold hover:underline cursor-pointer" onClick={() => onNavigate('proxies')}>Select Node &rarr;</span>
          </div>
          <div className="h-1 bg-teal-950 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Two Columns Section: Connection Guide & Diagnostic Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Integration Guide (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white tracking-wider">CORE PROXIES CONNECTION SETUP</h3>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-semibold uppercase">INTEGRATION MANUAL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/40 p-3 rounded border border-slate-800/80 hover:border-slate-700/60 transition">
              <div className="h-6 w-6 rounded bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-400">1</div>
              <h4 className="text-xs font-bold text-slate-200 mt-2">Pick Residential Host</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Filter by country, region, city or target ISP to target safe residential IP subnet loops.
              </p>
            </div>

            <div className="bg-slate-950/40 p-3 rounded border border-slate-800/80 hover:border-slate-700/60 transition">
              <div className="h-6 w-6 rounded bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-400">2</div>
              <h4 className="text-xs font-bold text-slate-200 mt-2">Assign Local port-forward</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Associate the node with a target loopback port (e.g. <code className="text-emerald-300 bg-slate-900 px-1 rounded">30000</code>).
              </p>
            </div>

            <div className="bg-slate-950/40 p-3 rounded border border-slate-800/80 hover:border-slate-700/60 transition">
              <div className="h-6 w-6 rounded bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-400">3</div>
              <h4 className="text-xs font-bold text-slate-200 mt-2">Target proxy socket</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Configure SOCKS5 on your desktop browser, bot, or multi-login profiles to 127.0.0.1:port.
              </p>
            </div>
          </div>

          {/* Quick Config Script copy block */}
          <div className="bg-slate-950 p-4 rounded border border-slate-850">
            <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>SIMULATED CMD ROUTE VERIFIER:</span>
              <span className="text-[9px] text-indigo-400">SOCKS5 PROTOCOL DEFAULT</span>
            </h4>
            <pre className="text-[11px] select-all cursor-pointer font-mono text-indigo-300 mt-2 bg-slate-955 p-2 rounded overflow-x-auto leading-relaxed border border-slate-900">
              curl --socks5-hostname 127.0.0.1:30000 https://ipinfo.io/json
            </pre>
            <p className="text-[10px] text-slate-500 mt-2">
              Run this cmd in bash/terminal to verify SOCKS5 routing status. Ensure router engine states are set to active.
            </p>
          </div>
        </div>

        {/* Diagnostic Status Monitor (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white tracking-wider">DAEMON DIAGNOSTICS</h3>
              <CircleDot className={`w-3 h-3 ${engineActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            </div>

            <div className="space-y-3 mt-4 text-[11px]">
              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                <span className="text-slate-400 font-mono">SOCKS5 Daemon Port:</span>
                <span className="text-slate-200 font-bold font-mono">1080 (Loop Gate)</span>
              </div>
              
              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                <span className="text-slate-400 font-mono">Encryption Layer:</span>
                <span className="text-emerald-400 font-bold">CHACHA20-IETF</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                <span className="text-slate-400 font-mono">Active Port Maps:</span>
                <span className="text-indigo-300 font-bold font-mono">{ports.length} allocations</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                <span className="text-slate-400 font-mono">Engine Version:</span>
                <span className="text-slate-400 font-mono">v1.4.2 (Stable Production)</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-900/50 p-3 rounded mt-4">
            <h4 className="text-xs font-bold text-indigo-305 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Security Advisory</span>
            </h4>
            <p className="text-[10px] text-indigo-400/90 mt-1 leading-snug">
              Residential SOCKS5 loops use real host nodes, rotating addresses automatically if standard connections drop. Ensure proxy credentials of selected maps match active router leases.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access to Port Forwarding Grid */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider">DASHBOARD EXTRAS</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Quickly view available system action pathways.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <button 
            onClick={() => onNavigate('proxies')}
            className="flex flex-col text-left p-3 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900 hover:border-slate-705 group transition"
          >
            <div className="flex justify-between w-full items-center">
              <span className="text-xs font-bold text-white group-hover:text-indigo-300">Browse Live Residential Pools</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <p className="text-[11px] text-slate-505 mt-1">Get precise SOCKS5 proxy IP nodes across diverse geo subnets.</p>
          </button>

          <button 
            onClick={() => onNavigate('ports')}
            className="flex flex-col text-left p-3 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900 hover:border-slate-705 group transition"
          >
            <div className="flex justify-between w-full items-center">
              <span className="text-xs font-bold text-white group-hover:text-amber-300">SOCKS5 Port Remapping</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <p className="text-[11px] text-slate-505 mt-1">Bind target residential IP routes to specific local loop ports.</p>
          </button>

          <button 
            onClick={() => onNavigate('settings')}
            className="flex flex-col text-left p-3 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-900 hover:border-slate-705 group transition"
          >
            <div className="flex justify-between w-full items-center">
              <span className="text-xs font-bold text-white group-hover:text-emerald-300">General Core Settings</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <p className="text-[11px] text-slate-505 mt-1">Manage network proxies timeout thresholds, bypass domains lists, and key tokens.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
