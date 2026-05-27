import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Sparkles, HelpCircle, ArrowUpRight, CheckCheck, Loader2 } from 'lucide-react';

interface CdkActivationViewProps {
  onActivateKey: (ipAmount: number) => void;
  onShowToast: (message: string, type: 'info' | 'success' | 'warning') => void;
}

export default function CdkActivationView({
  onActivateKey,
  onShowToast
}: CdkActivationViewProps) {
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activatedAmount, setActivatedAmount] = useState(0);

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      onShowToast('Please type or paste a valid 9Router activation code.', 'warning');
      return;
    }

    setLoading(true);
    // Simulate API license verification
    setTimeout(() => {
      setLoading(false);
      
      const cleanKey = keyInput.trim().toUpperCase();
      let addedIps = 500; // Basic code
      
      if (cleanKey.includes('UNLIMITED') || cleanKey.includes('PRO')) {
        addedIps = 5000;
      } else if (cleanKey.includes('ENTERPRISE')) {
        addedIps = 20000;
      } else if (cleanKey.length < 10) {
        onShowToast('Simulated activation failed: Key code contains invalid check-sum payload.', 'warning');
        return;
      }

      onActivateKey(addedIps);
      setActivatedAmount(addedIps);
      setIsSuccess(true);
      onShowToast(`Successfully topped up active proxy account with +${addedIps} IP lease balance!`, 'success');
      setKeyInput('');
    }, 1800);
  };

  return (
    <div className="space-y-4 font-sans animate-fade-in text-slate-205">
      
      {/* Upper header */}
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span>CDK activation and Voucher Topups</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Redeem professional activation keys or residential SOCKS5 coupon codes to scale secure proxy limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Activation form */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            CDK License Redemption
          </h4>

          {isSuccess ? (
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-5 rounded-lg text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCheck className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">License Token Redeemed!</h5>
                <p className="text-xs text-slate-400 mt-0.5">
                  Added <span className="text-emerald-400 font-bold">+{activatedAmount} IP Leases</span> onto core serkac100@gmail.com account.
                </p>
              </div>
              <button
                onClick={() => setIsSuccess(false)}
                className="bg-slate-805 hover:bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded transition uppercase tracking-wider font-semibold"
              >
                Redeem another key SOCKS5
              </button>
            </div>
          ) : (
            <form onSubmit={handleActivation} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase font-mono">
                  Input license key verification code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="9R-VOUCHER-XXXXXX-XXXXXX"
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2.5 text-xs text-indigo-300 placeholder-slate-700 font-mono focus:outline-none focus:border-indigo-505"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                  Redeem codes instantly to upgrade standard accounts inside sandbox.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-10 rounded text-xs flex items-center justify-center space-x-2 border border-indigo-505 transition whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying key signature...</span>
                  </>
                ) : (
                  <>
                    <span>Redeem Activation Token</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Test voucher box */}
          <div className="bg-slate-950 p-3 rounded.lg border border-slate-850/85">
            <span className="text-[10px] text-indigo-400 uppercase font-mono font-bold block mb-1">FREE SIMULATED CODES FOR TESTING</span>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex justify-between items-center bg-slate-900 px-2 py-1 rounded">
                <code className="text-indigo-305 font-bold font-mono">9R-PRO-5000-IPKB</code>
                <button 
                  onClick={() => {
                    setKeyInput('9R-PRO-5000-IPKB');
                    onShowToast('Voucher code pasted.', 'info');
                  }}
                  className="text-[10px] text-indigo-400 hover:underline"
                >
                  Quick Paste
                </button>
              </div>
              <div className="flex justify-between items-center bg-slate-900 px-2 py-1 rounded">
                <code className="text-indigo-305 font-bold font-mono">9R-ENTERPRISE-20000-XKB</code>
                <button 
                  onClick={() => {
                    setKeyInput('9R-ENTERPRISE-20000-XKB');
                    onShowToast('Enterprise voucher pasted.', 'info');
                  }}
                  className="text-[10px] text-indigo-400 hover:underline"
                >
                  Quick Paste
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Activation Guidelines
            </h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Each valid SOCKS5 voucher is single-use and maps to your current registered profile email.</li>
              <li>Activated queries balance do not expire, maintaining indefinite storage limits.</li>
              <li>Enterprise keys automatically double total parallel thread allocations up to 1000 concurrent loops.</li>
            </ul>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-900/50 p-4.5 rounded mt-4">
            <h5 className="text-xs font-bold text-indigo-305 flex items-center space-x-1">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Security Advisory</span>
            </h5>
            <p className="text-[10px] text-indigo-400/90 mt-1 leading-normal">
              Avoid buying keys from illegal, non-official resale channels. Authentic keys are cryptographically signed using CHACHA25-IETF standards to protect against fake loop requests.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
