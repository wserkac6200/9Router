import { 
  LayoutDashboard, 
  Globe, 
  ArrowLeftRight, 
  Terminal, 
  KeyRound, 
  Map, 
  ScrollText, 
  Settings as SettingsIcon,
  CircleDot,
  User,
  Activity,
  LogOut,
  HelpCircle
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'proxies' 
  | 'ports' 
  | 'api' 
  | 'cdk' 
  | 'map' 
  | 'logs' 
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  engineActive: boolean;
  totalPortsCount: number;
  userEmail: string;
  userTier: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  engineActive,
  totalPortsCount,
  userEmail,
  userTier
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, label: 'Proxy Dashboard', icon: LayoutDashboard },
    { id: 'proxies' as const, label: 'Residential IPs', icon: Globe, badge: 'NEW' },
    { id: 'ports' as const, label: 'Port Forward List', icon: ArrowLeftRight, badgeCount: totalPortsCount },
    { id: 'api' as const, label: 'API Proxy Maker', icon: Terminal },
    { id: 'cdk' as const, label: 'CDK Activation', icon: KeyRound },
    { id: 'map' as const, label: 'Virtual Route Map', icon: Map },
    { id: 'logs' as const, label: 'Engine Live Logs', icon: ScrollText },
    { id: 'settings' as const, label: 'SOCKS5 Settings', icon: SettingsIcon }
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between select-none">
      {/* Upper Navigation Items */}
      <div className="py-4">
        <div className="px-4 mb-4">
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">CORE ROUTER NAVIGATION</span>
        </div>

        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-950/40 font-bold border-l-4 border-indigo-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>

                {/* Optional Badges */}
                {item.badge && (
                  <span className="text-[9px] bg-red-650 text-red-100 px-1 rounded-sm font-bold tracking-tighter">
                    {item.badge}
                  </span>
                )}
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold font-mono">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Details & System Ticker */}
      <div className="border-t border-slate-900 bg-slate-950/40 p-4 font-sans">
        {/* Connection status line */}
        <div className="flex items-center justify-between mb-4 bg-slate-900/60 p-2.5 rounded border border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <CircleDot className={`w-3.5 h-3.5 ${engineActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              {engineActive && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 leading-none">
              <div className="font-mono text-slate-200 text-xs truncate">127.0.0.1:1080</div>
              <div className="text-[9px] text-slate-500 mt-0.5">LOCAL GATEWAY</div>
            </div>
          </div>
          <Activity className={`w-3.5 h-3.5 ${engineActive ? 'text-emerald-400' : 'text-slate-500'}`} />
        </div>

        {/* User Stats Card */}
        <div className="flex items-center space-x-3 text-left">
          <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-700/40 flex items-center justify-center text-indigo-400 text-sm font-bold">
            <User className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-100 truncate">{userEmail}</div>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-[9px] bg-indigo-950/80 text-indigo-300 border border-indigo-500/25 px-1 py-0.2 rounded font-bold uppercase-subtle tracking-wider leading-none">
                {userTier}
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              <span className="text-[9px] text-slate-500 leading-none">Active</span>
            </div>
          </div>
        </div>

        {/* Support buttons */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <a 
            href="#support" 
            onClick={(e) => {
              e.preventDefault();
              alert("9Router Support: Join our simulated Discord at discord.gg/9router-mock");
            }}
            className="hover:text-slate-300 flex items-center space-x-1"
          >
            <HelpCircle className="w-3 h-3 text-slate-500" />
            <span>Proxy Help</span>
          </a>
          <span>9Router Client v1.4.2</span>
        </div>
      </div>
    </div>
  );
}
