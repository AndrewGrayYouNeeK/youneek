import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Wallet, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const OWNER_WALLET = '0x1234...5678';

function WalletCard({ title, address, icon: Icon, transactions, color, totalIn, totalOut }) {
  const [copied, setCopied] = React.useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`p-6 bg-gradient-to-r ${color} bg-opacity-10`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button 
                onClick={copyAddress}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                <span className="font-mono">{address}</span>
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <a 
            href={`https://plasmascan.to/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ExternalLink className="w-4 h-4 mr-2" />
              Explorer
            </Button>
          </a>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-xl p-3">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
              <ArrowDownLeft className="w-4 h-4" />
              Total In
            </div>
            <div className="text-xl font-bold text-white">{totalIn.toLocaleString()} YNK</div>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="flex items-center gap-2 text-orange-400 text-sm mb-1">
              <ArrowUpRight className="w-4 h-4" />
              Total Out
            </div>
            <div className="text-xl font-bold text-white">{totalOut.toLocaleString()} YNK</div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="p-4 max-h-80 overflow-y-auto">
        <div className="text-xs text-white/40 uppercase tracking-wide mb-3">Recent Transactions</div>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-white/40">No transactions yet</div>
          ) : (
            transactions.slice(0, 10).map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.tx_type === 'incoming' ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                    {tx.tx_type === 'incoming' ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-orange-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">
                      {tx.tx_type === 'incoming' ? 'Received' : 'Sent'}
                    </div>
                    <div className="text-xs text-white/40 font-mono">
                      {tx.tx_hash?.slice(0, 10)}...
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${tx.tx_type === 'incoming' ? 'text-green-400' : 'text-orange-400'}`}>
                    {tx.tx_type === 'incoming' ? '+' : '-'}{tx.amount?.toLocaleString()} YNK
                  </div>
                  <div className="text-xs text-white/40">
                    {tx.timestamp ? format(new Date(tx.timestamp), 'MMM d, HH:mm') : 'N/A'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function TransparencySection() {
  const { data: transactions = [] } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => base44.entities.WalletTransaction.list('-timestamp', 100),
  });

  const calculateTotals = (txs) => {
    const totalIn = txs.filter(tx => tx.tx_type === 'incoming').reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalOut = txs.filter(tx => tx.tx_type === 'outgoing').reduce((sum, tx) => sum + (tx.amount || 0), 0);
    return { totalIn, totalOut };
  };

  const totals = calculateTotals(transactions);

  return (
    <section id="transparency" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTU5IDFIMXY1OGg1OFYxeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
            🔴 Live Data
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My <span className="text-orange-400">Wallet</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Nothing to hide. Watch every token move in real-time. My wallet, fully public.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <WalletCard
            title="Owner's Wallet"
            address={OWNER_WALLET}
            icon={Wallet}
            transactions={transactions}
            color="from-purple-500 to-blue-500"
            totalIn={totals.totalIn}
            totalOut={totals.totalOut}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/40 text-sm mt-8"
        >
          All transactions are publicly verifiable on the Plasma blockchain explorer
        </motion.p>
      </div>
    </section>
  );
}