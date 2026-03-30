import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, QrCode, Wallet, CreditCard, Info, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import QRCode from 'qrcode';

function useQrData(urlOrText) {
  const [dataUrl, setDataUrl] = React.useState('');
  React.useEffect(() => {
    let cancelled = false;
    async function gen() {
      if (!urlOrText) { setDataUrl(''); return; }
      try {
        const url = await QRCode.toDataURL(urlOrText, { width: 180, margin: 1 });
        if (!cancelled) setDataUrl(url);
      } catch (e) {
        console.error('QR generation failed', e);
        if (!cancelled) setDataUrl('');
      }
    }
    gen();
    return () => { cancelled = true; };
  }, [urlOrText]);
  return dataUrl;
}

function CryptoCard({ label, network, address, explorerBase }) {
  const [copied, setCopied] = React.useState(false);
  const hasAddress = !!address && address !== 'YOUR_ADDRESS_HERE';
  const qr = useQrData(hasAddress ? address : '');

  const copy = () => {
    if (!hasAddress) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-lg">{label}</CardTitle>
            <div className="text-xs text-white/60">Network: {network}</div>
          </div>
        </div>
        <QrCode className="h-5 w-5 text-white/60" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={hasAddress ? address : 'Pending — add donation address'}
            className="bg-black/30 text-white placeholder:text-white/40"
          />
          <Button variant="outline" onClick={copy} disabled={!hasAddress} className="border-white/20 text-white">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-32 w-32 rounded-lg bg-black/30 flex items-center justify-center overflow-hidden">
            {qr ? (
              <img src={qr} alt={`${label} QR`} className="h-full w-full object-contain" />
            ) : (
              <div className="text-xs text-white/40 p-2 text-center">QR appears when address is set</div>
            )}
          </div>
          <div className="text-sm text-white/70 space-y-1">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-amber-300" />
              <span>Send only {label.split(' ')[0]} on {network}. Funds sent to the wrong network may be lost.</span>
            </div>
            {hasAddress && explorerBase && (
              <a
                href={`${explorerBase}${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white/80 hover:text-white"
              >
                View on explorer <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DonationsSection() {
  // TODO: Replace placeholders with your real donation addresses
  const YNK_PLASMA_ADDRESS = 'YOUR_YNK_PLASMA_ADDRESS';
  const ETH_ADDRESS = 'YOUR_ETH_ADDRESS';
  const USDC_ETH_ADDRESS = 'YOUR_USDC_ETH_ADDRESS';

  const [amount, setAmount] = React.useState('25');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const donateUSD = async () => {
    setError('');
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { setError('Enter a valid amount'); return; }
    setLoading(true);
    try {
      const res = await base44.functions.invoke('create-checkout', { amount: val });
      const url = res?.data?.redirectUrl || res?.data?.checkoutSession?.redirectUrl;
      if (url) {
        window.location.href = url;
      } else {
        setError('Could not start checkout. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donations" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative">
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_40%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-sm bg-emerald-500/15 text-emerald-300 border border-emerald-400/20 mb-3">Support Our Mission</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Donate to Help Pets in Need</h2>
          <p className="text-white/70 max-w-2xl mx-auto">Choose crypto or card. Every contribution funds emergency vet care and success stories.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Crypto Donations */}
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wallet className="h-5 w-5" /> Donate with Crypto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <CryptoCard
                  label="YNK"
                  network="Plasma"
                  address={YNK_PLASMA_ADDRESS}
                  explorerBase={'https://plasmascan.to/address/'}
                />
                <CryptoCard
                  label="ETH"
                  network="Ethereum Mainnet"
                  address={ETH_ADDRESS}
                  explorerBase={'https://etherscan.io/address/'}
                />
                <CryptoCard
                  label="USDC"
                  network="Ethereum (ERC-20)"
                  address={USDC_ETH_ADDRESS}
                  explorerBase={'https://etherscan.io/address/'}
                />
              </div>
              <div className="text-xs text-white/50">
                Tip: For ERC-20 tokens (USDC), confirm contract and network in your wallet before sending.
              </div>
            </CardContent>
          </Card>

          {/* USD Donations */}
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5" /> Donate with Card (USD)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/30 text-white max-w-[180px]"
                  placeholder="Amount (USD)"
                />
                <Button onClick={donateUSD} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Starting checkout…' : 'Donate with Card'}
                </Button>
              </div>
              {error && <div className="text-amber-300 text-sm">{error}</div>}
              <div className="text-xs text-white/50">
                Secure checkout • No account required
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}