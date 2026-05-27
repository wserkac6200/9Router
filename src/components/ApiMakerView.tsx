import { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  HelpCircle, 
  Check, 
  FileCode2, 
  Cpu,
  BookmarkCheck
} from 'lucide-react';

interface ApiMakerViewProps {
  onShowToast: (message: string, type: 'info' | 'success' | 'warning') => void;
  userEmail: string;
}

type CodeLang = 'curl' | 'python' | 'nodejs' | 'go';

export default function ApiMakerView({
  onShowToast,
  userEmail
}: ApiMakerViewProps) {
  const [targetCountry, setTargetCountry] = useState('us');
  const [apiKey, setApiKey] = useState('9r_live_8fe3b2a21e0ca97d8c2bb9de91522f');
  const [activeLang, setActiveLang] = useState<CodeLang>('curl');
  const [copied, setCopied] = useState(false);

  // States for query filters
  const [stickyIps, setStickyIps] = useState(true);
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [customState, setCustomState] = useState('');
  const [customCity, setCustomCity] = useState('');

  const generateSocksUrl = () => {
    let base = `socks5://serkac100_api-country_${targetCountry}`;
    if (customState) {
      base += `-state_${customState.toLowerCase().replace(/\s+/g, '')}`;
    }
    if (customCity) {
      base += `-city_${customCity.toLowerCase().replace(/\s+/g, '')}`;
    }
    if (stickyIps) {
      base += `-session_sticky${timeMinutes}m`;
    } else {
      base += `-session_random`;
    }
    base += `:${apiKey}@socks.9router.space:10000`;
    return base;
  };

  const getCodeSnippet = () => {
    const socksUrl = generateSocksUrl();
    switch (activeLang) {
      case 'curl':
        return `curl --socks5-hostname "${socksUrl}" "https://ipinfo.io/json"`;
      case 'python':
        return `import requests

proxies = {
    'http': '${socksUrl}',
    'https': '${socksUrl}'
}

try:
    response = requests.get('https://ipinfo.io/json', proxies=proxies, timeout=10)
    print("Routing Status Code:", response.status_code)
    print(response.json())
except Exception as e:
    print("Routing failed:", e)`;
      case 'nodejs':
        return `import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';

const agent = new SocksProxyAgent('${socksUrl}');

axios.get('https://ipinfo.io/json', { httpAgent: agent, httpsAgent: agent })
  .then(res => {
    console.log('Target IP details:', res.data);
  })
  .catch(err => {
    console.error('Routing failed:', err.message);
  });`;
      case 'go':
        return `package main

import (
	"fmt"
	"io"
	"net/http"
	"golang.org/x/net/proxy"
)

func main() {
	dialer, err := proxy.SOCKS5("tcp", "socks.9router.space:10000", &proxy.Auth{
		User: "serkac100_api-country_${targetCountry}-session_${stickyIps ? "sticky" : "random"}",
		Password: "${apiKey}",
	}, proxy.Direct)
	if err != nil {
		panic(err)
	}

	transport := &http.Transport{Dial: dialer.Dial}
	client := &http.Client{Transport: transport}

	resp, err := client.Get("https://ipinfo.io/json")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    onShowToast('API configuration proxy line copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans animate-fade-in text-slate-200">
      
      {/* Intro info box */}
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <h3 className="text-sm font-bold text-white tracking-wider flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>9Router SOCKS5 Endpoint Generator (Auth Bypass)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-snug">
          Programmatically query, request, and fetch rotating or sticky residential proxy subnets using standard in-line credential routing formats. No GUI required to query ports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Parameters Filter column (5 cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider border-b border-slate-850 pb-2">
            API Parameters Builder
          </h4>

          {/* API Key */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Your Client API Token</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-505"
            />
          </div>

          {/* Geo location country target */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Target Country</label>
            <select
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-505"
            >
              <option value="us">United States (us)</option>
              <option value="de">Germany (de)</option>
              <option value="gb">United Kingdom (gb)</option>
              <option value="vn">Vietnam (vn)</option>
              <option value="sg">Singapore (sg)</option>
              <option value="jp">Japan (jp)</option>
              <option value="ca">Canada (ca)</option>
              <option value="au">Australia (au)</option>
            </select>
          </div>

          {/* Dynamic state / city filter inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">State (Opt)</label>
              <input
                type="text"
                placeholder="california"
                value={customState}
                onChange={(e) => setCustomState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-505"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">City (Opt)</label>
              <input
                type="text"
                placeholder="losangeles"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-505"
              />
            </div>
          </div>

          {/* Rotations style select status */}
          <div className="space-y-2 pt-2 border-t border-slate-850">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Lease Hold Style</span>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="stickyBox"
                checked={stickyIps}
                onChange={(e) => setStickyIps(e.target.checked)}
                className="accent-indigo-500 rounded bg-slate-950 border-slate-800"
              />
              <label htmlFor="stickyBox" className="text-xs text-slate-305 font-medium cursor-pointer">
                Sticky Session IP Lease Mode
              </label>
            </div>

            {stickyIps && (
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850 text-xs">
                <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Session Hold Limit (Minutes)</label>
                <div className="flex gap-2">
                  {[10, 30, 60, 120].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => setTimeMinutes(minutes)}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition ${
                        timeMinutes === minutes 
                          ? 'bg-indigo-650 border-indigo-550 text-white' 
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {minutes} min
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Generator block (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/60 rounded-xl border border-slate-805 p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-2">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Programmatic Code Playground
            </h4>

            {/* Language select buttons tabs */}
            <div className="flex bg-slate-950 border border-slate-800 rounded p-0.5 space-x-1">
              {(['curl', 'python', 'nodejs', 'go'] as CodeLang[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition font-mono ${
                    activeLang === lang 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Readout compiled proxy line info */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Dynamic Generated proxy URI:</span>
            <div className="bg-slate-950/80 p-2 border border-slate-850 rounded font-mono text-xs text-indigo-305 flex justify-between items-center gap-2 select-all overflow-x-auto">
              <span className="truncate">{generateSocksUrl()}</span>
              <button 
                onClick={handleCopyCode} 
                className="text-slate-400 hover:text-white shrink-0 p-1 bg-slate-900 border border-slate-800 rounded"
                title="Copy full socks URL"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="relative">
            <div className="absolute right-2 top-2 z-10">
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 bg-indigo-650 hover:bg-indigo-550 border border-indigo-505 text-white text-xs px-2.5 py-1 rounded transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <pre className="bg-slate-950/90 text-indigo-200 font-mono text-[11px] p-4.5 rounded-lg border border-slate-850 overflow-x-auto select-all leading-relaxed whitespace-pre h-72">
              {getCodeSnippet()}
            </pre>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-850 flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <p className="text-[10px] text-slate-400 leading-snug">
              Note: Endpoint query strings automatically bind user balances with matching residential proxies. Each successful curl query counts as exactly 1 residential IP connection lease request. Over-querying the API endpoint with invalid credentials blocks standard API IP nodes automatically.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
