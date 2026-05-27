import { useState, useMemo } from 'react';
import { Map, Wifi, Radio, Globe, Navigation, Activity } from 'lucide-react';
import { ForwardedPort } from '../types';

interface NetworkMapViewProps {
  ports: ForwardedPort[];
  engineActive: boolean;
  onShowToast: (message: string, type: 'info' | 'success' | 'warning') => void;
}

interface MapNode {
  code: string;
  name: string;
  x: number; // SVG center %
  y: number; // SVG center %
  city: string;
}

const MAP_NODES: Record<string, MapNode> = {
  US: { code: 'US', name: 'United States', x: 28, y: 38, city: 'Los Angeles' },
  DE: { code: 'DE', name: 'Germany', x: 50, y: 32, city: 'Frankfurt' },
  GB: { code: 'GB', name: 'United Kingdom', x: 47, y: 28, city: 'London' },
  VN: { code: 'VN', name: 'Vietnam', x: 74, y: 55, city: 'Hanoi' },
  SG: { code: 'SG', name: 'Singapore', x: 73, y: 62, city: 'Singapore' },
  JP: { code: 'JP', name: 'Japan', x: 82, y: 40, city: 'Tokyo' },
  FR: { code: 'FR', name: 'France', x: 48, y: 34, city: 'Paris' },
  CA: { code: 'CA', name: 'Canada', x: 26, y: 28, city: 'Toronto' },
  AU: { code: 'AU', name: 'Australia', x: 85, y: 78, city: 'Sydney' },
  IN: { code: 'IN', name: 'India', x: 67, y: 48, city: 'Mumbai' },
  KR: { code: 'KR', name: 'South Korea', x: 80, y: 41, city: 'Gangnam' }
};

export default function NetworkMapView({
  ports,
  engineActive,
  onShowToast
}: NetworkMapViewProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const activePorts = useMemo(() => {
    return ports.filter(p => p.status === 'active');
  }, [ports]);

  const selectedPortDetails = useMemo(() => {
    if (!selectedRouteId) return activePorts[0] || null;
    return activePorts.find(p => p.id === selectedRouteId) || activePorts[0] || null;
  }, [activePorts, selectedRouteId]);

  return (
    <div className="space-y-4 font-sans animate-fade-in text-slate-200">
      
      {/* Description Header */}
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <h3 className="text-sm font-bold text-white tracking-wider flex items-center space-x-2">
          <Map className="w-4 h-4 text-canvas-icon text-indigo-400" />
          <span>Active Tunnel Topology Wireframe</span>
        </h3>
        <p className="text-xs text-slate-405 mt-1 leading-normal">
          Interactive wireframe rendering active SOCKS5 proxy hops globally. Select any mapped port to inspect internal traceroutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Connection Map canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/60 rounded-xl border border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative min-h-[400px]">
          <div className="flex justify-between items-center z-10 select-none pb-2">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              REAL-TIME SOCKS5 MAPPED COORDINATES ({activePorts.length} ACTIVE)
            </span>
            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-indigo-400 border border-slate-850 font-mono">
              LOCALHOST: 127.0.0.1 MIDDLEWARE
            </span>
          </div>

          {/* Graphical mapping container */}
          <div className="relative flex-1 w-full bg-slate-955/80 border border-slate-900 rounded-lg overflow-hidden flex items-center justify-center my-2 select-none min-h-[300px]">
            
            {/* Background Map Projection grid dots style */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F172A_1px,transparent_1px),linear-gradient(to_bottom,#0F172A_1px,transparent_1px)] bg-[size:16px_16px] opacity-40"></div>

            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[340px] select-none text-slate-700">
              
              {/* Draw abstract grid markers for coordinates */}
              <circle cx="50" cy="50" r="48" className="stroke-slate-900/40 fill-none stroke-[0.5] stroke-dasharray-[2_2]" />
              <line x1="50" y1="2" x2="50" y2="98" className="stroke-slate-900/30 stroke-[0.5]" />
              <line x1="2" y1="50" x2="98" y2="50" className="stroke-slate-900/30 stroke-[0.5]" />

              {/* Central localhost coordinate node */}
              <g transform="translate(50, 50)">
                <circle r="4.5" className="fill-indigo-950 stroke-indigo-400 stroke-[1.5] animate-pulse" />
                <circle r="2" className="fill-indigo-400" />
              </g>

              {/* Localhost Text overlay label */}
              <text x="50" y="58" className="fill-slate-500 font-mono text-[2.5px] font-bold text-center" textAnchor="middle">
                127.0.0.1 (LOCALHOST)
              </text>

              {/* Draw static country nodes dots */}
              {Object.values(MAP_NODES).map((node) => {
                const isActive = activePorts.some(p => p.targetCountryCode === node.code);
                return (
                  <g key={node.code} transform={`translate(${node.x}, ${node.y})`}>
                    <circle 
                      r="2" 
                      className={`transition duration-300 ${isActive ? 'fill-emerald-500/30 stroke-emerald-400 stroke-[1]' : 'fill-slate-900 stroke-slate-800'}`} 
                    />
                    {isActive && (
                      <circle r="1" className="fill-emerald-400 animate-ping" />
                    )}
                    <text x="0" y="-3.5" className="fill-slate-400 font-mono text-[2px] font-semibold" textAnchor="middle">
                      {node.code}
                    </text>
                  </g>
                );
              })}

              {/* Draw glowing tracer lines from Localhost (50,50) to active ports target nodes */}
              {activePorts.map((port) => {
                const targetNode = MAP_NODES[port.targetCountryCode];
                if (!targetNode) return null;
                const isSelected = selectedPortDetails?.id === port.id;

                return (
                  <g key={port.id}>
                    {/* Glowing curve line path with animation */}
                    <path
                      d={`M 50 50 Q ${(50 + targetNode.x) / 2} ${(50 + targetNode.y) / 2 - 10} ${targetNode.x} ${targetNode.y}`}
                      className={`fill-none transition-all duration-350 opacity-80 ${
                        isSelected 
                          ? 'stroke-indigo-400 stroke-[0.8] stroke-dasharray-[1_1] animate-none' 
                          : 'stroke-emerald-500/40 stroke-[0.4] stroke-dasharray-[2_2]'
                      }`}
                    />
                    {/* Animated moving packet marker */}
                    <circle r="0.6" className="fill-white">
                      <animateMotion
                        path={`M 50 50 Q ${(50 + targetNode.x) / 2} ${(50 + targetNode.y) / 2 - 10} ${targetNode.x} ${targetNode.y}`}
                        dur={`${Math.max(1, (port.ping / 50))}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* Standby Placeholder warning */}
            {activePorts.length === 0 && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-center p-6 select-none z-20">
                <Globe className="w-8 h-8 text-indigo-400/50 mb-2 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-white text-xs font-bold uppercase tracking-wider font-mono">Topology Standby Mode</span>
                <p className="text-[10px] text-slate-500 max-w-sm mt-1 leading-relaxed">
                  Map clean residential SOCKS5 nodes in the <b>Residential IPs</b> menu first to visualize active loop traceroute topologies.
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-500 mt-1 justify-between flex select-none">
            <span>Graph nodes use SVG coordinates mapped onto basic coordinate maps</span>
            <span>Click any mapped routes below to inspect traceroute hops</span>
          </p>
        </div>

        {/* Selected Port route tracer inspector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-850 pb-2 flex justify-between items-center select-none">
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                SOCKS5 Tracer Hops
              </h4>
              <Activity className={`w-3.5 h-3.5 ${activePorts.length > 0 ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>

            {/* If there is a selected route, list traceroute steps */}
            {selectedPortDetails ? (
              <div className="space-y-3.5">
                {/* Active port switch selector dropdown */}
                <div className="bg-slate-950/80 p-2 rounded border border-slate-850">
                  <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Select Tunnel Port Line</label>
                  <select
                    value={selectedRouteId || ''}
                    onChange={(e) => setSelectedRouteId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-indigo-305 font-mono font-bold"
                  >
                    {activePorts.map((ap) => (
                      <option key={ap.id} value={ap.id}>
                        {ap.localPort} &rarr; {ap.targetCity} ({ap.targetCountryCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vertical tracer dots step loop */}
                <div className="space-y-3 relative pl-4 border-l border-slate-800/80 ml-2 font-mono text-[10px]">
                  
                  {/* Step 1: User browser */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-950 border border-indigo-500 flex items-center justify-center text-[8px] text-indigo-400 font-bold">
                      1
                    </span>
                    <span className="text-slate-500">CLIENT APP CALL</span>
                    <div className="text-slate-100 font-bold">127.0.0.1 (Internal Tunnel)</div>
                  </div>

                  {/* Step 2: 9Router Listen Port */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-950 border border-indigo-500/70 flex items-center justify-center text-[8px] text-indigo-400 font-bold">
                      2
                    </span>
                    <span className="text-slate-500">LOCAL GATE LISTEN</span>
                    <div className="text-emerald-400 font-bold">127.0.0.1:{selectedPortDetails.localPort}</div>
                  </div>

                  {/* Step 3: Residential SOCKS5 Node IP */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-950 border border-indigo-505 flex items-center justify-center text-[8px] text-indigo-400 font-bold">
                      3
                    </span>
                    <span className="text-slate-500">RESIDENTIAL MIDDLE NODE</span>
                    <div className="text-white font-bold">{selectedPortDetails.proxyIp}</div>
                    <div className="text-[9px] text-slate-500 leading-none mt-0.5">ISP: {selectedPortDetails.isp}</div>
                  </div>

                  {/* Step 4: Final query delivery */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-950 border border-indigo-505 flex items-center justify-center text-[8px] text-indigo-400 font-bold">
                      4
                    </span>
                    <span className="text-slate-500">EDGE HOP EXIT GEOLOC</span>
                    <div className="text-indigo-305 font-bold">{selectedPortDetails.targetCity.toUpperCase()}, {selectedPortDetails.targetCountryCode}</div>
                    <span className="text-[9px] text-emerald-400">RTT Speed check: {selectedPortDetails.ping}ms</span>
                  </div>

                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-600 font-mono text-[11px] py-12 flex flex-col justify-center items-center">
                <span>Waiting for route connections...</span>
                <p className="text-[10px] text-slate-700 max-w-xs mt-2 leading-relaxed">
                  Traceroute hops analyze latency delays dynamically when an active port forwarding session is mapped on the router.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-850 p-3 rounded mt-4">
            <h5 className="text-[10px] font-bold text-slate-400 flex items-center space-x-1 uppercase tracking-wider">
              <Navigation className="w-3.5 h-3.5 shrink-0" />
              <span>Multi-Hop Encryption</span>
            </h5>
            <p className="text-[9px] text-slate-505 mt-1 leading-normal">
              Active sessions carry multi-layer TLS wrap. Selected SOCKS5 sockets encrypt headers server-side.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
