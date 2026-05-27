import { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Wifi, 
  Star, 
  HelpCircle, 
  Activity, 
  ArrowRight, 
  X, 
  Check, 
  SlidersHorizontal,
  FolderSync
} from 'lucide-react';
import { ProxyItem, ForwardedPort } from '../types';
import { AVAILABLE_COUNTRIES, SAMPLE_ISPS } from '../data/proxyData';

interface ProxyListViewProps {
  proxies: ProxyItem[];
  ports: ForwardedPort[];
  onAssignPort: (proxy: ProxyItem, port: number) => void;
  onToggleFavorite: (id: string) => void;
  onShowToast: (message: string, type: 'info' | 'success' | 'warning') => void;
  engineActive: boolean;
}

export default function ProxyListView({
  proxies,
  ports,
  onAssignPort,
  onToggleFavorite,
  onShowToast,
  engineActive
}: ProxyListViewProps) {
  // Filter States
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [zipFilter, setZipFilter] = useState('');
  const [selectedIsp, setSelectedIsp] = useState('All ISPs');
  const [maxPing, setMaxPing] = useState<number>(300);
  const [ipSearched, setIpSearched] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'ping' | 'ip' | 'speed'>('ping');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Interactive Port Picker Modal
  const [showPortModal, setShowPortModal] = useState(false);
  const [selectedProxy, setSelectedProxy] = useState<ProxyItem | null>(null);
  const [customPort, setCustomPort] = useState<number>(5000);

  // Suggest local ports that are not yet occupied or top defaults
  const reservedPorts = useMemo(() => {
    return new Set(ports.map(p => p.localPort));
  }, [ports]);

  const recommendedPorts = useMemo(() => {
    const list = [];
    let start = 5000;
    while (list.length < 5) {
      if (!reservedPorts.has(start)) {
        list.push(start);
      }
      start++;
    }
    return list;
  }, [reservedPorts]);

  // Set default custom target port when modal is triggered
  const handleOpenPortModal = (proxy: ProxyItem) => {
    if (!engineActive) {
      onShowToast('Cannot map SOCKS5 ports. Please activate the 9Router Engine first!', 'warning');
      return;
    }
    setSelectedProxy(proxy);
    // Find the first available recommended port
    const firstFree = recommendedPorts[0] || 5000;
    setCustomPort(firstFree);
    setShowPortModal(true);
  };

  const handleConfirmPortForward = () => {
    if (!selectedProxy) return;

    if (customPort < 1024 || customPort > 65535) {
      onShowToast('Please provide a legal port code between 1024 and 65535.', 'warning');
      return;
    }

    if (reservedPorts.has(customPort)) {
      // Find what proxy is already using this port
      const occupiedBy = ports.find(p => p.localPort === customPort);
      onShowToast(`Port ${customPort} is already occupied by ${occupiedBy?.proxyIp}. Choose a different line.`, 'warning');
      return;
    }

    onAssignPort(selectedProxy, customPort);
    setShowPortModal(false);
    setSelectedProxy(null);
  };

  // Filter Logic
  const filteredProxies = useMemo(() => {
    return proxies.filter((item) => {
      // Country Filter
      if (selectedCountry !== 'ALL' && item.countryCode !== selectedCountry) return false;
      // State Filter
      if (stateFilter && !item.state.toLowerCase().includes(stateFilter.toLowerCase())) return false;
      // City Filter
      if (cityFilter && !item.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      // ZIP Filter
      if (zipFilter && !item.zip.toLowerCase().includes(zipFilter.toLowerCase())) return false;
      // ISP Filter
      if (selectedIsp !== 'All ISPs' && item.isp !== selectedIsp) return false;
      // Ping Slider limit
      if (item.ping > maxPing) return false;
      // Free Text IP Search
      if (ipSearched && !item.ip.includes(ipSearched)) return false;
      // Favorites Toggle
      if (showOnlyFavorites && !item.isFavorite) return false;

      return true;
    }).sort((a, b) => {
      let multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'ping') {
        return (a.ping - b.ping) * multiplier;
      } else if (sortBy === 'speed') {
        return (b.speedMbps - a.speedMbps) * multiplier; // higher is better
      } else {
        return a.ip.localeCompare(b.ip) * multiplier;
      }
    });
  }, [proxies, selectedCountry, stateFilter, cityFilter, zipFilter, selectedIsp, maxPing, ipSearched, showOnlyFavorites, sortBy, sortOrder]);

  const toggleSort = (field: 'ping' | 'ip' | 'speed') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4 font-sans animate-fade-in text-slate-200">
      
      {/* Upper filter header panels */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100">Residential SOCKS5 Filters</span>
          </div>
          <button 
            onClick={() => {
              setSelectedCountry('ALL');
              setStateFilter('');
              setCityFilter('');
              setZipFilter('');
              setSelectedIsp('All ISPs');
              setMaxPing(300);
              setIpSearched('');
              setShowOnlyFavorites(false);
              onShowToast('Proxy filters cleared to defaults.', 'info');
            }}
            className="text-[10px] text-indigo-400 font-bold hover:underline"
          >
            Clear All Filters
          </button>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Country selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Country Geo-Target</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {AVAILABLE_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* State Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">State / Province</label>
            <input
              type="text"
              placeholder="e.g. California"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-505"
            />
          </div>

          {/* City Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">City Node</label>
            <input
              type="text"
              placeholder="e.g. Los Angeles"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-505"
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">ZIP/Postal Code</label>
            <input
              type="text"
              placeholder="e.g. 90001"
              value={zipFilter}
              onChange={(e) => setZipFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-505"
            />
          </div>
        </div>

        {/* Extra Level Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-end">
          {/* Target ISP */}
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Carrier / ISP</label>
            <select
              value={selectedIsp}
              onChange={(e) => setSelectedIsp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-505 font-medium"
            >
              {SAMPLE_ISPS.map((isp) => (
                <option key={isp} value={isp}>{isp}</option>
              ))}
            </select>
          </div>

          {/* Ping Threshold slider */}
          <div className="md:col-span-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
              <span>Latency Limit</span>
              <span className="text-emerald-400 font-mono">&le; {maxPing} ms</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="10"
                max="300"
                value={maxPing}
                onChange={(e) => setMaxPing(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Find IP Text field */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Instant IP Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search matching IP..."
                value={ipSearched}
                onChange={(e) => setIpSearched(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-505 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Favorites Star layout */}
          <div className="md:col-span-1 flex items-center h-8.5 justify-center">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded border text-xs font-bold transition ${
                showOnlyFavorites 
                  ? 'bg-amber-500/10 border-amber-500/80 text-amber-400 shadow-md' 
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="sr-only">Favorites</span>
              <span className="font-sans text-[11px]">Starred</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Interface */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
        
        {/* Table stats banner */}
        <div className="bg-slate-950/40 p-3 px-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
          <div>
            <span>Found </span>
            <span className="text-white font-bold font-mono">{filteredProxies.length}</span>
            <span> compatible IPs matching criteria out of {proxies.length} absolute nodes.</span>
          </div>

          <div className="flex space-x-3 mt-2 sm:mt-0 text-[11px]">
            <span>Sort by:</span>
            <button 
              onClick={() => toggleSort('ping')}
              className={`hover:text-white font-bold ${sortBy === 'ping' ? 'text-indigo-400 underline decoration-indigo-400' : 'text-slate-400'}`}
            >
              Ping {sortBy === 'ping' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => toggleSort('speed')}
              className={`hover:text-white font-bold ${sortBy === 'speed' ? 'text-indigo-400 underline decoration-indigo-400' : 'text-slate-400'}`}
            >
              Speed {sortBy === 'speed' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => toggleSort('ip')}
              className={`hover:text-white font-bold ${sortBy === 'ip' ? 'text-indigo-400 underline decoration-indigo-400' : 'text-slate-400'}`}
            >
              IP Node {sortBy === 'ip' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Custom Interactive Table */}
        <div className="overflow-x-auto">
          {filteredProxies.length > 0 ? (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-450 border-b border-slate-850">
                <tr>
                  <th className="py-2.5 px-4 w-10">Star</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Geo Location</th>
                  <th className="py-2.5 px-3">ZIP Code</th>
                  <th className="py-2.5 px-3">Residential ISP / Carrier</th>
                  <th className="py-2.5 px-3">Speed</th>
                  <th className="py-2.5 px-3 text-center">Ping (RTT)</th>
                  <th className="py-2.5 px-4 text-right w-36">Action Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-sans">
                {filteredProxies.map((item) => {
                  const isStarred = item.isFavorite;
                  const isMapped = ports.some(p => p.proxyIp === item.ip && p.status === 'active');
                  const mappedPortNum = ports.find(p => p.proxyIp === item.ip && p.status === 'active')?.localPort;

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-850/40 transition cursor-pointer group ${
                        isMapped ? 'bg-indigo-950/10 text-white' : ''
                      }`}
                      onDoubleClick={() => {
                        navigator.clipboard.writeText(item.ip);
                        onShowToast(`IP node ${item.ip} copied to host clipboard.`, 'success');
                      }}
                      title="Double-click proxy row to copy IP address"
                    >
                      <td className="py-2.5 px-4 text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id);
                          }}
                          className={`${isStarred ? 'text-amber-400' : 'text-slate-600 hover:text-slate-450'} transition-colors`}
                        >
                          <Star className="w-4 h-4 fill-current stroke-[1.5]" />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-100 font-semibold">
                        <div className="flex items-center space-x-1.5">
                          <span>{item.ip}</span>
                          {isMapped && (
                            <span className="text-[9px] bg-emerald-950 text-emerald-300 uppercase font-bold border border-emerald-800 px-2 py-0.5 rounded font-mono">
                              Port: {mappedPortNum}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-200">
                        <div className="flex items-center space-x-1.5">
                          {/* Circle code flag block */}
                          <div className="w-5 h-4.5 bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-bold rounded-sm font-mono text-indigo-305">
                            {item.countryCode}
                          </div>
                          <span className="truncate max-w-[150px]" title={`${item.country}, ${item.state}, ${item.city}`}>
                            {item.city}, {item.state}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-450">{item.zip}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-medium truncate max-w-[180px]" title={item.isp}>
                        {item.isp}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-indigo-305 font-bold">
                        {item.speedMbps} <span className="text-[10px] text-slate-505 font-normal">Mb/s</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border ${
                          item.ping < 50 
                            ? 'bg-emerald-950/65 text-emerald-400 border-emerald-900/40' 
                            : item.ping < 120 
                              ? 'bg-amber-950/65 text-amber-400 border-amber-900/40' 
                              : 'bg-rose-950/65 text-rose-400 border-rose-900/40'
                        }`}>
                          {item.ping} ms
                        </span>
                      </td>

                      {/* Port Map buttons */}
                      <td className="py-2.5 px-4 text-right">
                        {isMapped ? (
                          <span className="text-[11px] text-slate-500 font-semibold">Already in loop</span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPortModal(item);
                            }}
                            className="bg-slate-800 border border-slate-700 hover:bg-indigo-650 hover:border-indigo-550 hover:text-white text-slate-300 font-bold px-3 py-1 text-[11px] rounded transition-all focus:outline-none"
                          >
                            Forward to Port
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center">
              <FolderSync className="w-8 h-8 text-slate-600 mb-2 animate-spin" />
              <span className="text-sm font-bold">No SOCKS5 Residential Nodes Match Filters</span>
              <p className="text-xs text-slate-600 mt-1 max-w-md">
                Try widening your geo-target parameters, increasing latency ranges or disabling Star filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Modal for port mapping */}
      {showPortModal && selectedProxy && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Header */}
            <div className="bg-slate-955 p-4 border-b border-slate-800 flex justify-between items-center select-none">
              <div className="flex items-center space-x-2">
                <div className="p-1 px-1.5 bg-indigo-600/30 rounded text-indigo-400 border border-indigo-500/20 text-xs font-bold font-mono">
                  MAP ROW
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Configure Port Forwarding</h3>
              </div>
              <button 
                onClick={() => setShowPortModal(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              
              {/* Target info box */}
              <div className="bg-slate-950/60 p-3 rounded border border-slate-850 space-y-2">
                <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider font-mono">Proxy Node Lease Target</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  <div>
                    <span className="text-slate-500">IP address:</span>
                    <div className="font-bold font-mono text-white mt-0.5">{selectedProxy.ip}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Country/City:</span>
                    <div className="font-bold text-white mt-0.5">{selectedProxy.city}, {selectedProxy.countryCode}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Carrier ISP:</span>
                    <div className="font-bold text-slate-400 mt-0.5 truncate">{selectedProxy.isp}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Speed Status:</span>
                    <div className="font-bold text-indigo-400 mt-0.5 font-mono">{selectedProxy.speedMbps} Mbps</div>
                  </div>
                </div>
              </div>

              {/* Port assignment select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Local Listen Port (1024 - 65535)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1024"
                    max="65535"
                    value={customPort}
                    onChange={(e) => setCustomPort(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-505 font-mono font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-505 mt-1.5 leading-snug">
                  Ports will map locally on loop back addresses. Target loop node: <code className="bg-slate-950 text-indigo-400 px-1 rounded">127.0.0.1:{customPort}</code> SOCKS5 profile.
                </p>
              </div>

              {/* Recommended list */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick Select Free Ports</span>
                <div className="flex gap-2">
                  {recommendedPorts.map((port) => (
                    <button
                      key={port}
                      onClick={() => setCustomPort(port)}
                      className={`px-3 py-1 font-mono font-bold text-[11px] rounded transition border ${
                        customPort === port 
                          ? 'bg-indigo-650 border-indigo-500 text-white shadow-md' 
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {port}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-slate-955 p-3 px-5 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setShowPortModal(false)}
                className="px-3.5 py-1.5 rounded text-xs font-semibold text-slate-405 hover:bg-slate-850"
              >
                Cancel Mapped Loop
              </button>
              <button
                onClick={handleConfirmPortForward}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded text-xs flex items-center space-x-1 border border-indigo-505"
              >
                <span>Activate Forward Loop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
