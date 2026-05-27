import { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Trash2, 
  ExternalLink, 
  Activity, 
  Wifi, 
  Play, 
  PowerOff, 
  Search, 
  RefreshCcw,
  RefreshCw,
  HardDriveDownload,
  HardDriveUpload,
  Radio,
  FileCheck2
} from 'lucide-react';
import { ForwardedPort } from '../types';

interface PortForwardListViewProps {
  ports: ForwardedPort[];
  onDestroyPort: (id: string) => void;
  onDestroyAllPorts: () => void;
  onShowToast: (message: string, type: 'info' | 'success' | 'warning') => void;
  engineActive: boolean;
}

export default function PortForwardListView({
  ports,
  onDestroyPort,
  onDestroyAllPorts,
  onShowToast,
  engineActive
}: PortForwardListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ticker, setTicker] = useState(0);

  // Simulate updating active port bytes inside UI state dynamically to show performance
  useEffect(() => {
    if (!engineActive) return;
    const interval = setInterval(() => {
      setTicker(prev => prev + 1);
    }, 1200);
    return () => clearInterval(interval);
  }, [engineActive]);

  const filteredPorts = ports.filter(port => {
    return (
      port.localPort.toString().includes(searchTerm) ||
      port.proxyIp.includes(searchTerm) ||
      port.targetCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.targetCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.isp.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getDynamicBytes = (baseValue: number, factor: number) => {
    if (!engineActive) return baseValue;
    return baseValue + Math.floor(ticker * Math.random() * factor * 1400);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const handleTestLatency = (port: ForwardedPort) => {
    onShowToast(`Simulating connection test over local listen 127.0.0.1:${port.localPort} -> ${port.proxyIp}.`, 'info');
    setTimeout(() => {
      onShowToast(`Active tunnel is optimal. Real-time RTT latency: ${port.ping} ms. Data integrity: 100%.`, 'success');
    }, 1000);
  };

  const handleCopyCommand = (port: ForwardedPort) => {
    const cmd = `curl --socks5-hostname 127.0.0.1:${port.localPort} https://ipinfo.io/json`;
    navigator.clipboard.writeText(cmd);
    onShowToast(`Copied test command curl to host clipboard!`, 'success');
  };

  return (
    <div className="space-y-4 font-sans animate-fade-in text-slate-205">
      
      {/* Top action header info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800 gap-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Active SOCKS5 Mappings Panel</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Display all active ports currently listening on loopback 127.0.0.1 bound to global residential proxy nodes.
          </p>
        </div>

        {ports.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to release all active port mapping loops?')) {
                onDestroyAllPorts();
              }
            }}
            className="bg-red-950/20 hover:bg-red-900/30 text-red-400 font-bold px-3 py-1.5 text-xs rounded border border-red-500/30 transition flex items-center space-x-1.5"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>Kill All Mapping Loops</span>
          </button>
        )}
      </div>

      {/* Quick Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Filter map tables by port, Node IP or geolocation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-505"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="text-[11px] text-slate-505 font-mono">
          <span>Active Loopbacks listening: </span>
          <span className="text-white font-bold">{ports.length} ports mapped</span>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
        {filteredPorts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-450 border-b border-slate-850">
                <tr>
                  <th className="py-3 px-4">Local Port</th>
                  <th className="py-3 px-3">Bound proxy Node IP</th>
                  <th className="py-3 px-3">Tunnel Geo Destination</th>
                  <th className="py-3 px-3">ISP Carrier</th>
                  <th className="py-3 px-3 text-center">Data Loop (Sent / Recv)</th>
                  <th className="py-3 px-3 text-center">Link Ping</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-sans">
                {filteredPorts.map((port) => {
                  const currentSent = getDynamicBytes(port.sentBytes, 1.2);
                  const currentRecv = getDynamicBytes(port.receivedBytes, 4.5);

                  return (
                    <tr key={port.id} className="hover:bg-slate-850/30 transition">
                      
                      {/* Port Label */}
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
                          {port.localPort}
                        </span>
                      </td>

                      {/* Bound Proxy Node IP */}
                      <td className="py-3 px-3 font-mono font-semibold text-indigo-305">
                        {port.proxyIp}
                      </td>

                      {/* Geo Dest */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-4.5 bg-slate-950 border border-slate-805 flex items-center justify-center text-[10px] font-bold rounded-sm font-mono text-indigo-305">
                            {port.targetCountryCode}
                          </div>
                          <span>{port.targetCity}, {port.targetCountry}</span>
                        </div>
                      </td>

                      {/* ISP */}
                      <td className="py-3 px-3 text-slate-400 font-medium truncate max-w-[140px]" title={port.isp}>
                        {port.isp}
                      </td>

                      {/* Dynamic bytes sent/recv */}
                      <td className="py-3 px-3 text-center font-mono text-[11px]">
                        <div className="flex items-center justify-center space-x-2.5">
                          <span className="text-slate-400 whitespace-nowrap flex items-center space-x-0.5">
                            <HardDriveUpload className="w-2.5 h-2.5 text-slate-500" />
                            <span>{formatBytes(currentSent)}</span>
                          </span>
                          <span className="text-slate-650">|</span>
                          <span className="text-slate-200 font-bold whitespace-nowrap flex items-center space-x-0.5">
                            <HardDriveDownload className="w-2.5 h-2.5 text-indigo-400 animate-bounce" style={{ animationDuration: '2s' }} />
                            <span>{formatBytes(currentRecv)}</span>
                          </span>
                        </div>
                      </td>

                      {/* Link Ping */}
                      <td className="py-3 px-3 text-center">
                        <span className="bg-slate-950/65 text-emerald-400 border border-emerald-950 px-2 py-0.5 rounded font-mono font-bold font-semibold text-[10px]">
                          {port.ping} ms
                        </span>
                      </td>

                      {/* Status pill */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          engineActive 
                            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' 
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${engineActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                          <span>{engineActive ? 'Active' : 'Offline'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          
                          {/* Test Tunnel */}
                          <button
                            onClick={() => handleTestLatency(port)}
                            title="Test Loop Latency"
                            className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 hover:bg-slate-755 transition"
                          >
                            <Activity className="w-3.5 h-3.5" />
                          </button>

                          {/* Copy curl button */}
                          <button
                            onClick={() => handleCopyCommand(port)}
                            title="Copy test curl command"
                            className="p-1 px-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-400 bg-slate-800 rounded border border-slate-705 hover:bg-slate-755 transition font-mono flex items-center space-x-0.5"
                          >
                            <span>curl</span>
                          </button>

                          {/* Release Port loop mapping */}
                          <button
                            onClick={() => {
                              onDestroyPort(port.id);
                              onShowToast(`Port ${port.localPort} proxy mapping released successfully.`, 'info');
                            }}
                            title="Close Tunnel & Release Local Port"
                            className="p-1 text-red-400 hover:text-white bg-red-950/20 hover:bg-red-650 rounded border border-red-900/30 hover:border-red-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center">
            <ArrowLeftRight className="w-10 h-10 text-slate-700 mb-2 animate-pulse" />
            <span className="text-sm font-bold">No Active Port Loops remap files found</span>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              There are currently no active ports remapping to residential proxy SOCKS5 IPs. Head over to <b>Residential IPs</b> menu to select and bind nodes.
            </p>
          </div>
        )}
      </div>

      {/* Bottom configuration helper */}
      <div className="bg-slate-905 p-4 rounded-xl border border-slate-850">
        <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-2">
          <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Multi-Threaded Proxy Controller Advice</span>
        </h4>
        <p className="text-xs text-slate-405 mt-2 leading-relaxed">
          The 9Router desktop background service uses socket multiplexing. You can map hundreds of ports in parallel without losing loop speed. The total concurrent speed depends on the combined capacities of the chosen residential ISP nodes. Try to pick node hosts sharing close locations with low ping indicators in the residential IPs tab.
        </p>
      </div>

    </div>
  );
}
