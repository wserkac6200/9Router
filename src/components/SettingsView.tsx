import { useState } from 'react';
import { 
  Settings, 
  HelpCircle, 
  ShieldAlert, 
  FileCheck2, 
  Sparkles, 
  Power, 
  Unlock, 
  Check, 
  HardDrive
} from 'lucide-react';

interface SettingsViewProps {
  onShowToast: (message: string, type: 'info' | 'success' | 'warning') => void;
  userEmail: string;
  userTier: string;
}

export default function SettingsView({
  onShowToast,
  userEmail,
  userTier
}: SettingsViewProps) {
  // Option parameters states
  const [dnsBypassLocal, setDnsBypassLocal] = useState(true);
  const [keepAliveSeconds, setKeepAliveSeconds] = useState(60);
  const [socksAuthToken, setSocksAuthToken] = useState('serkac_socks_key_8aa13b190cde');
  const [maxThreadsLimit, setMaxThreadsLimit] = useState(200);
  const [upstreamMode, setUpstreamMode] = useState<'sticky' | 'rotating'>('sticky');
  const [bypassDomainsList, setBypassDomainsList] = useState('*.localhost\n*.local\n192.168.*\n10.*');

  const handleSaveSettings = () => {
    onShowToast('Config parameters saved. Active threads updated with new timeouts.', 'success');
  };

  return (
    <div className="space-y-4 font-sans animate-fade-in text-slate-205">
      
      {/* Settings Description Top */}
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-855">
        <h3 className="text-sm font-bold text-white tracking-wider flex items-center space-x-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>SOCKS5 Daemon Configurations Manager</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Adjust DNS leak protection modes, SOCKS5 authorization strings, background thread quotas, and upstream rotating routers parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Core settings form parameters */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4.5">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Upstream Network Settings
          </h4>

          {/* Upstream style select */}
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 mb-1.5 uppercase font-mono">Upstream Tunnel Binding Mode</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUpstreamMode('sticky')}
                className={`flex flex-col text-left p-2.5 rounded border transition font-sans ${
                  upstreamMode === 'sticky' 
                    ? 'bg-indigo-650/15 border-indigo-500 text-white font-bold' 
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Sticky Lease (Hold IP)</span>
                <span className="text-[9.5px] text-slate-500 mt-0.5 normal-case font-normal leading-tight">Keeps same IP route alive for back-to-back requests.</span>
              </button>

              <button
                type="button"
                onClick={() => setUpstreamMode('rotating')}
                className={`flex flex-col text-left p-2.5 rounded border transition font-sans ${
                  upstreamMode === 'rotating' 
                    ? 'bg-indigo-650/15 border-indigo-505 text-white font-bold' 
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Automatic Rotating</span>
                <span className="text-[9.5px] text-slate-500 mt-0.5 normal-case font-normal leading-tight">Requests a clean unique IP subnet on every single query thread.</span>
              </button>
            </div>
          </div>

          {/* Keepalive and Max threads parameters fields  */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-1.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase font-mono">SOCKET KEEPALIVE SECS</label>
              <input
                type="number"
                min="5"
                max="300"
                value={keepAliveSeconds}
                onChange={(e) => setKeepAliveSeconds(Number(e.target.value))}
                className="w-full bg-slate-955 border border-slate-850 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-505"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase font-mono font-mono">MAX PARALLEL THREADS</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={maxThreadsLimit}
                onChange={(e) => setMaxThreadsLimit(Number(e.target.value))}
                className="w-full bg-slate-955 border border-slate-850 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-505"
              />
            </div>
          </div>

          {/* Authentication loop credential bypass */}
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 mb-1 uppercase font-mono">SOCKS5 Inbound authorization Token</label>
            <input
              type="text"
              value={socksAuthToken}
              onChange={(e) => setSocksAuthToken(e.target.value)}
              className="w-full bg-slate-955 border border-slate-850 rounded px-3 py-1.5 text-xs text-indigo-305 font-mono focus:outline-none focus:border-indigo-505"
            />
            <p className="text-[10px] text-slate-505 mt-1">Provide custom passwords to secure loop-back sockets against unauthorized sniffing.</p>
          </div>

          <div className="pt-2 border-t border-slate-850">
            <button
              onClick={handleSaveSettings}
              className="bg-indigo-650 hover:bg-indigo-550 border border-indigo-505 text-white font-bold px-4 py-2 rounded text-xs flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Save Configurations</span>
            </button>
          </div>
        </div>

        {/* Security Parameters & Bypass domains list (4 cols) */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            DNS Leak & Loopback Bypass domains
          </h4>

          {/* DNS Leak protection toggle state */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-200">DNS Leak Guard protection</span>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Reroutes all local host name lookups over the remote SOCKS5 pipe node.</p>
              </div>
              <button
                type="button"
                onClick={() => setDnsBypassLocal(!dnsBypassLocal)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  dnsBypassLocal ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  dnsBypassLocal ? 'translate-x-4' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
          </div>

          {/* Bypass domain text listing block */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase font-mono">Loopback Bypass Domains (No Proxy Hops)</label>
            <textarea
              rows={4}
              value={bypassDomainsList}
              onChange={(e) => setBypassDomainsList(e.target.value)}
              placeholder="e.g. *.localhost"
              className="w-full bg-slate-955 border border-slate-850 rounded p-2.5 text-xs text-white placeholder-slate-705 font-mono focus:outline-none focus:border-indigo-505 leading-relaxed"
            />
            <p className="text-[10px] text-slate-505 mt-1 leading-normal">
              List glob domains to ignore proxy routes and bind directly to local ethernet cards.
            </p>
          </div>

          {/* Device Profile info */}
          <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-2 text-xs">
            <span className="text-[10px] text-indigo-400 font-bold uppercase font-mono block">CLIENT PROFILE DETAILS</span>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <span>Account Registration:</span>
              <span className="text-white font-bold font-mono">{userEmail}</span>
              <span>License Scope:</span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">{userTier} Profile</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
