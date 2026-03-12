import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Coins, Award, Wallet } from 'lucide-react';

const TARGET_TOTAL_STAKE = 1_000_000; // display goal for progress bar

function useTotals() {
  const { data: positions = [] } = useQuery({
    queryKey: ['staking-positions'],
    queryFn: async () => base44.entities.StakingPosition.list('-created_date', 200),
    initialData: [],
  });

  const totalStaked = positions
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return { positions, totalStaked };
}

function RewardPreview({ amount, start_date, last_claimed_at }) {
  // Very simple preview: 10% APR, linear per second
  const apr = 0.10;
  const from = new Date(last_claimed_at || start_date).getTime();
  const seconds = Math.max(0, (Date.now() - from) / 1000);
  const yearly = amount * apr;
  const perSecond = yearly / (365 * 24 * 3600);
  const earned = perSecond * seconds;
  return <span>{earned.toFixed(4)} YNK</span>;
}

export default function StakingSection() {
  const qc = useQueryClient();
  const { positions, totalStaked } = useTotals();
  const [amount, setAmount] = React.useState('');

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.StakingPosition.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staking-positions'] });
      setAmount('');
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (position) => {
      // Compute rewards on client for demo purposes only
      const apr = 0.10;
      const from = new Date(position.last_claimed_at || position.start_date).getTime();
      const seconds = Math.max(0, (Date.now() - from) / 1000);
      const yearly = position.amount * apr;
      const perSecond = yearly / (365 * 24 * 3600);
      const earned = perSecond * seconds; // simplistic

      return base44.entities.StakingPosition.update(position.id, {
        claimed_rewards_total: (position.claimed_rewards_total || 0) + earned,
        last_claimed_at: new Date().toISOString(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staking-positions'] }),
  });

  const handleStake = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    createMutation.mutate({ amount: amt, start_date: new Date().toISOString(), status: 'active' });
  };

  const progress = Math.min(100, (totalStaked / TARGET_TOTAL_STAKE) * 100);

  return (
    <section id="staking" className="py-24 relative bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4 flex items-center gap-2 justify-center">
            <Award className="w-4 h-4" /> Earn Yields
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Stake YNK</h2>
          <p className="text-white/60">Lock your tokens and earn simple yields. Claim anytime.</p>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Coins className="w-5 h-5" /> Your staking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-white/80 mb-3">
                <span className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Total Staked</span>
                <span className="font-semibold">{totalStaked.toLocaleString()} YNK</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-right text-xs text-white/40 mt-1">Goal: {TARGET_TOTAL_STAKE.toLocaleString()} YNK</div>
            </div>

            <form onSubmit={handleStake} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="number"
                min="0"
                step="0.0001"
                placeholder="Amount (YNK)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/10 text-white placeholder:text-white/40"
              />
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                Stake YNK <ChevronRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="space-y-3">
              {positions.length === 0 ? (
                <div className="text-white/50 text-sm">No active stakes yet.</div>
              ) : (
                positions.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-white text-sm">
                      <div className="font-medium">{p.amount} YNK</div>
                      <div className="text-xs text-white/50">Since {new Date(p.start_date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-white/60">Earned: <RewardPreview amount={p.amount} start_date={p.start_date} last_claimed_at={p.last_claimed_at} /></div>
                      <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10" onClick={() => claimMutation.mutate(p)}>Claim</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}