import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Wallet, ArrowDown, ArrowLeftRight, Percent, Info } from 'lucide-react';

function formatAddress(addr) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

export default function SwapWidget() {
  const { toast } = useToast();
  // Simulated wallet
  const [address, setAddress] = React.useState(null);
  const connected = Boolean(address);

  // Simulated wallet balances
  const [balances, setBalances] = React.useState({ eth: 1.5, ynk: 0 });

  // Simulated pool reserves (constant product AMM)
  const [reserves, setReserves] = React.useState({ eth: 500, ynk: 5_000_000 }); // ~1 ETH ≈ 10,000 YNK
  const fee = 0.003; // 0.3%
  const slippageTolerance = 0.01; // 1%

  const [amountIn, setAmountIn] = React.useState('');

  const spotPriceYNKPerETH = reserves.eth > 0 ? reserves.ynk / reserves.eth : 0;

  const parsedIn = Math.max(0, parseFloat(amountIn || '0')) || 0;
  const amountInWithFee = parsedIn * (1 - fee);
  const amountOut = reserves.eth > 0 && reserves.ynk > 0 && amountInWithFee > 0
    ? (amountInWithFee * reserves.ynk) / (reserves.eth + amountInWithFee)
    : 0;

  const minReceived = amountOut * (1 - slippageTolerance);

  // Price impact vs spot (approx)
  const spotOut = parsedIn * spotPriceYNKPerETH;
  const priceImpact = spotOut > 0 ? Math.max(0, 1 - (amountOut / spotOut)) * 100 : 0;

  const canSwap = connected && parsedIn > 0 && parsedIn <= balances.eth && amountOut > 0;

  const handleConnect = () => {
    if (connected) {
      setAddress(null);
      return;
    }
    // Pseudo address
    const rand = Math.random().toString(16).slice(2, 10);
    setAddress('0x' + rand.padEnd(40, 'a').slice(0, 40));
  };

  const setMax = () => {
    setAmountIn(String(Math.max(0, balances.eth)));
  };

  const onSwap = () => {
    if (!canSwap) return;

    // Update wallet: spend ETH, receive YNK
    setBalances(prev => ({
      eth: +(prev.eth - parsedIn).toFixed(6),
      ynk: +(prev.ynk + amountOut).toFixed(6),
    }));

    // Update pool reserves: add full input (fee stays in pool implicitly), remove output
    setReserves(prev => ({
      eth: +(prev.eth + parsedIn).toFixed(6),
      ynk: +(prev.ynk - amountOut).toFixed(6),
    }));

    toast({
      title: 'Swap successful',
      description: `Swapped ${parsedIn.toFixed(6)} ETH for ${amountOut.toFixed(2)} YNK` ,
    });

    setAmountIn('');
  };

  return (
    <section id="swap" className="py-20 bg-gradient-to-b from-slate-900/60 to-slate-950">
      <div className="max-w-xl mx-auto px-6">
        <div className="text-center mb-6">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-3 inline-flex items-center gap-2">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Simulated Swap
          </Badge>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">Swap ETH for YNK</h2>
          <p className="text-white/60 mt-2">No real wallet interaction. Rates are simulated for demo.</p>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-white">Swap</CardTitle>
            <Button size="sm" variant={connected ? 'secondary' : 'default'} onClick={handleConnect} className={connected ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30' : ''}>
              <Wallet className="w-4 h-4" /> {connected ? formatAddress(address) : 'Connect Wallet'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/70 text-sm">From</div>
                <div className="text-white/60 text-xs">Balance: {balances.eth.toFixed(6)} ETH</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.000001"
                    placeholder="0.0"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    className="bg-black/20 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="px-3 py-1.5 rounded-md bg-white/10 text-white text-sm">ETH</div>
                <Button type="button" variant="outline" size="sm" onClick={setMax} className="border-white/20 text-white">
                  Max
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center -my-1">
              <div className="p-2 rounded-full bg-white/10 border border-white/10">
                <ArrowDown className="w-4 h-4 text-white/60" />
              </div>
            </div>

            {/* To */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/70 text-sm">To (estimated)</div>
                <div className="text-white/60 text-xs">Balance: {balances.ynk.toFixed(2)} YNK</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input disabled value={amountOut ? amountOut.toFixed(2) : ''} className="bg-black/20 text-white placeholder:text-white/40" placeholder="0.0" />
                </div>
                <div className="px-3 py-1.5 rounded-md bg-white/10 text-white text-sm">YNK</div>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-white/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> Fee</span>
                <span>{(fee * 100).toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Price impact</span>
                <span>{priceImpact.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Min received (1% slippage)</span>
                <span>{minReceived > 0 ? minReceived.toFixed(2) : '0.00'} YNK</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rate</span>
                <span>1 ETH ≈ {spotPriceYNKPerETH.toLocaleString(undefined, { maximumFractionDigits: 2 })} YNK</span>
              </div>
            </div>

            <Button disabled={!canSwap} onClick={onSwap} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {connected ? (parsedIn > balances.eth ? 'Insufficient ETH balance' : 'Swap ETH → YNK') : 'Connect wallet to swap'}
            </Button>

            {/* Pool + hint */}
            <div className="text-xs text-white/50 text-center">
              <div className="mb-1">Pool: {reserves.eth.toFixed(2)} ETH • {reserves.ynk.toLocaleString()} YNK</div>
              <div className="inline-flex items-center gap-1"><Info className="w-3 h-3" /> Demo only. No on-chain transaction occurs.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}