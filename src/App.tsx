import { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar, { TabType } from './components/Sidebar';
import ProxyDashboard from './components/ProxyDashboard';
import ProxyListView from './components/ProxyListView';
import PortForwardListView from './components/PortForwardListView';
import ApiMakerView from './components/ApiMakerView';
import CdkActivationView from './components/CdkActivationView';
import NetworkMapView from './components/NetworkMapView';
import LogsView from './components/LogsView';
import SettingsView from './components/SettingsView';

import { ProxyItem, ForwardedPort, LogEntry, UserStats } from './types';
import { INITIAL_PROXIES, USER_INITIAL_STATS } from './data/proxyData';

import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // App Core States
  const [engineActive, setEngineActive] = useState(true);
  const [proxies, setProxies] = useState<ProxyItem[]>(INITIAL_PROXIES);
  const [userStats, setUserStats] = useState<UserStats>(USER_INITIAL_STATS);
  const [networkLatency, setNetworkLatency] = useState(38);

  // Initial loaded port bindings for quick testing
  const [ports, setPorts] = useState<ForwardedPort[]>([
    {
      id: 'port-1',
      localPort: 30000,
      proxyIp: '74.12.89.24',
      targetCountry: 'United States',
      targetCountryCode: 'US',
      targetCity: 'Manhattan',
      isp: 'Verizon Business',
      mappedAt: '2026-05-27 12:44:12',
      sentBytes: 154200,
      receivedBytes: 945600,
      status: 'active',
      ping: 56
    },
    {
      id: 'port-2',
      localPort: 30001,
      proxyIp: '113.161.42.10',
      targetCountry: 'Vietnam',
      targetCountryCode: 'VN',
      targetCity: 'District 1',
      isp: 'Viettel Telecom',
      mappedAt: '2026-05-27 13:02:44',
      sentBytes: 89400,
      receivedBytes: 1542800,
      status: 'active',
      ping: 18
    }
  ]);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Telemetry stdout logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '12:44:10',
      type: 'info',
      source: 'ENGINE',
      message: '9Router Client daemon initialized. Binding loops on localhost IPv4 stack.'
    },
    {
      id: 'log-2',
      timestamp: '12:44:12',
      type: 'success',
      source: 'PORT',
      message: 'Created forward loop: LocalPort 30000 bound onto proxy 74.12.89.24:3485 (US).'
    },
    {
      id: 'log-3',
      timestamp: '13:02:44',
      type: 'success',
      source: 'PORT',
      message: 'Created forward loop: LocalPort 30001 bound onto proxy 113.161.42.10:3485 (VN).'
    }
  ]);

  // Toast addition handler
  const triggerToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toasts
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error', source: 'ENGINE' | 'PORT' | 'API' | 'SECURITY' | 'USER') => {
    const time = new Date().toTimeString().split(' ')[0];
    const newLog: LogEntry = {
      id: Math.random().toString(),
      timestamp: time,
      type,
      source,
      message
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Change latency ping slightly on intervals when engine is running to show realistic network activity
  useEffect(() => {
    if (!engineActive) return;
    const interval = setInterval(() => {
      setNetworkLatency((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = prev + delta;
        return next > 10 ? next : 25;
      });
      // Add random lightweight log periodically mock daemon activities
      const events = [
        'Checked loop leases health. Active routes are optimal.',
        'SOCKS5 keepalive ping executed. Gateway response: 200 OK.',
        'Flush local system DNS cache success.'
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      addLog(randomEvent, 'info', 'ENGINE');
    }, 10000);

    return () => clearInterval(interval);
  }, [engineActive]);

  // Handle active port forward assign
  const handleAssignPortForward = (proxy: ProxyItem, targetPort: number) => {
    const newPortObj: ForwardedPort = {
      id: `port-${Math.random()}`,
      localPort: targetPort,
      proxyIp: proxy.ip,
      targetCountry: proxy.country,
      targetCountryCode: proxy.countryCode,
      targetCity: proxy.city,
      isp: proxy.isp,
      mappedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sentBytes: 0,
      receivedBytes: 0,
      status: 'active',
      ping: proxy.ping
    };

    setPorts((prev) => [...prev, newPortObj]);
    setUserStats((prev) => ({
      ...prev,
      totalUsed: prev.totalUsed + 1,
      balance: Math.max(0, prev.balance - 1)
    }));

    triggerToast(`SOCKS5 port remapped! Loop active on port ${targetPort}`, 'success');
    addLog(`Authorized forward rule. Mapped port ${targetPort} -> proxy ${proxy.ip}`, 'success', 'PORT');
  };

  // Handle destroy single port session
  const handleDestroyPort = (id: string) => {
    const target = ports.find(p => p.id === id);
    if (!target) return;

    setPorts((prev) => prev.filter(p => p.id !== id));
    triggerToast(`Closed forward loop on Port ${target.localPort}.`, 'warning');
    addLog(`Closed forwarding session. Released local port ${target.localPort}.`, 'warning', 'PORT');
  };

  // Kill all mappings
  const handleDestroyAllPorts = () => {
    setPorts([]);
    triggerToast('All active port forward loops successfully released.', 'warning');
    addLog('Released all active ports lease tables completely.', 'warning', 'PORT');
  };

  // Toggle favorite starred proxy
  const handleToggleFavorite = (id: string) => {
    setProxies((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    const target = proxies.find(p => p.id === id);
    if (target) {
      const starred = !target.isFavorite;
      triggerToast(starred ? `Added ${target.ip} to Starred Pool.` : `Removed ${target.ip} from Starred Pool.`, 'info');
      addLog(starred ? `Starred proxy node ${target.ip}.` : `Unstarred proxy node ${target.ip}.`, 'info', 'USER');
    }
  };

  // Top up CDK voucher keys
  const handleActivateKey = (ipAmount: number) => {
    setUserStats((prev) => ({
      ...prev,
      balance: prev.balance + ipAmount
    }));
    addLog(`License activation voucher redeemed for +${ipAmount} IP Queries.`, 'success', 'SECURITY');
  };

  const handleRefreshIPsPool = () => {
    triggerToast('Initiating recursive SOCKS5 trace checks... DNS cache cleaned.', 'info');
    addLog('Polled proxy API for status checking. Pool clean.', 'info', 'API');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased select-none">
      
      {/* TitleBar Windows style frame header */}
      <TitleBar 
        engineActive={engineActive}
        setEngineActive={setEngineActive}
        balance={userStats.balance}
        onRefreshStats={handleRefreshIPsPool}
        networkLatency={networkLatency}
        onShowToast={triggerToast}
      />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Left navigation */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            addLog(`Switched view panel selection: ${tab.toUpperCase()}`, 'info', 'USER');
          }}
          engineActive={engineActive}
          totalPortsCount={ports.length}
          userEmail={userStats.registeredEmail}
          userTier={userStats.currentTier}
        />

        {/* Action main content wrapper */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          <div className="max-w-6xl mx-auto h-full">
            
            {activeTab === 'dashboard' && (
              <ProxyDashboard 
                proxies={proxies}
                ports={ports}
                userStats={userStats}
                engineActive={engineActive}
                setEngineActive={setEngineActive}
                onNavigate={setActiveTab}
                onRefreshStats={handleRefreshIPsPool}
              />
            )}

            {activeTab === 'proxies' && (
              <ProxyListView 
                proxies={proxies}
                ports={ports}
                onAssignPort={handleAssignPortForward}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={triggerToast}
                engineActive={engineActive}
              />
            )}

            {activeTab === 'ports' && (
              <PortForwardListView 
                ports={ports}
                onDestroyPort={handleDestroyPort}
                onDestroyAllPorts={handleDestroyAllPorts}
                onShowToast={triggerToast}
                engineActive={engineActive}
              />
            )}

            {activeTab === 'api' && (
              <ApiMakerView 
                onShowToast={triggerToast}
                userEmail={userStats.registeredEmail}
              />
            )}

            {activeTab === 'cdk' && (
              <CdkActivationView 
                onActivateKey={handleActivateKey}
                onShowToast={triggerToast}
              />
            )}

            {activeTab === 'map' && (
              <NetworkMapView 
                ports={ports}
                engineActive={engineActive}
                onShowToast={triggerToast}
              />
            )}

            {activeTab === 'logs' && (
              <LogsView 
                logs={logs}
                onClearLogs={() => setLogs([])}
                onShowToast={triggerToast}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                onShowToast={triggerToast}
                userEmail={userStats.registeredEmail}
                userTier={userStats.currentTier}
              />
            )}

          </div>
        </main>
      </div>

      {/* Modern interactive float notification queues */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none select-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="flex items-center space-x-3 bg-slate-900/95 border border-slate-800 p-3.5 rounded-lg shadow-2xl backdrop-blur-md animate-slide-in pointer-events-auto"
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-450 shrink-0" />}

            <span className="text-xs font-semibold text-slate-100 pr-4 leading-snug">{toast.message}</span>
            
            <button 
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-500 hover:text-slate-350 shrink-0 ml-auto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
