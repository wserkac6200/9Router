export interface ProxyItem {
  id: string;
  ip: string;
  country: string;
  countryCode: string; // e.g. 'US', 'DE', 'GB', 'VN'
  state: string;
  city: string;
  zip: string;
  isp: string;
  ping: number; // latency in ms
  uptime: string;
  isFavorite?: boolean;
  status: 'online' | 'offline';
  speedMbps: number;
}

export interface ForwardedPort {
  id: string;
  localPort: number;
  proxyIp: string;
  targetCountry: string;
  targetCountryCode: string;
  targetCity: string;
  isp: string;
  mappedAt: string;
  sentBytes: number;
  receivedBytes: number;
  status: 'active' | 'closed';
  ping: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  source: 'ENGINE' | 'PORT' | 'API' | 'SECURITY' | 'USER';
  message: string;
}

export interface CountryData {
  code: string;
  name: string;
  count: number;
  regions: string[];
}

export interface UserStats {
  balance: number; // remaining IP queries
  totalUsed: number;
  activeLicenses: number;
  expireDate: string;
  registeredEmail: string;
  currentTier: 'Professional' | 'Unlimited' | 'Developer Enterprise';
}
