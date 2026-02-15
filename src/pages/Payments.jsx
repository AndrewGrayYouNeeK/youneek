import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Wallet, ArrowDownLeft, ArrowUpRight, Copy, Check, 
  ExternalLink, TrendingUp, DollarSign, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CHARITY_WALLET = '0x8765...4321';

export default function Payments() {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const { data: transactions = [] } = useQuery({
    queryKey: ['charity-transactions'],
    queryFn: () => base44.entities.WalletTransaction.filter({ wallet_type: 'charity' }, '-timestamp'),
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(CHARITY_WALLET);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const incomingTxs = transactions.filter(tx => tx.tx_type === 'incoming');
  const outgoingTxs = transactions.filter(tx => tx.tx_type === 'outgoing');

  const totalReceived = incomingTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalSent = outgoingTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const balance = totalReceived - totalSent;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Admin')} className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-white">Charity Wallet & Payments</h1>
          <p className="text-white/50">Track incoming 2% tax from YouNeeK trades</p>
        </div>

        {/* Wallet Address Card */}
        <Card className="bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 border-orange-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Your Charity Wallet Address</div>
                  <div className="text-lg font-bold text-white">Plasma Network</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-orange-500/30 text-white hover:bg-orange-500/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </div>

            <div className="bg-black/30 rounded-xl p-4 flex items-center justify-between">
              <code className="text-white font-mono text-lg">{CHARITY_WALLET}</code>
              <Button 
                size="sm"
                onClick={copyAddress}
                className="bg-white/10 hover:bg-white/20 border-none"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 text-sm text-white/60">
              💡 <strong>This is your charity treasury wallet.</strong> All 2% transaction taxes from YouNeeK trades are automatically sent here. You can use these funds to pay for vet emergencies.
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm text-white/60">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-3xl font-bold text-white">{balance.toLocaleString()}</div>
                  <div className="text-sm text-white/50">YNK Tokens</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/10 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-green-400">Total Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <ArrowDownLeft className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-3xl font-bold text-white">{totalReceived.toLocaleString()}</div>
                  <div className="text-sm text-white/50">{incomingTxs.length} transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-orange-400">Total Sent (Vet Payments)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-8 h-8 text-orange-400" />
                <div>
                  <div className="text-3xl font-bold text-white">{totalSent.toLocaleString()}</div>
                  <div className="text-sm text-white/50">{outgoingTxs.length} payments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Tabs */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-white/5 mb-6">
                <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
                <TabsTrigger value="incoming">Received ({incomingTxs.length})</TabsTrigger>
                <TabsTrigger value="outgoing">Sent ({outgoingTxs.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <TransactionList transactions={transactions} />
              </TabsContent>
              <TabsContent value="incoming">
                <TransactionList transactions={incomingTxs} />
              </TabsContent>
              <TabsContent value="outgoing">
                <TransactionList transactions={outgoingTxs} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div 
          key={tx.id}
          className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                tx.tx_type === 'incoming' ? 'bg-green-500/20' : 'bg-orange-500/20'
              }`}>
                {tx.tx_type === 'incoming' ? (
                  <ArrowDownLeft className="w-5 h-5 text-green-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-orange-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">
                    {tx.tx_type === 'incoming' ? 'Received' : 'Sent'}
                  </span>
                  {tx.tx_type === 'incoming' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      2% Tax
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  {tx.description || `${tx.tx_type === 'incoming' ? 'From' : 'To'}: ${tx.tx_type === 'incoming' ? tx.from_address : tx.to_address}`}
                </div>
                <div className="text-xs text-white/30 font-mono mt-1">
                  {tx.tx_hash?.slice(0, 20)}...
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-xl font-bold ${
                tx.tx_type === 'incoming' ? 'text-green-400' : 'text-orange-400'
              }`}>
                {tx.tx_type === 'incoming' ? '+' : '-'}{tx.amount?.toLocaleString()} YNK
              </div>
              {tx.usd_value && (
                <div className="text-sm text-white/40">
                  ${tx.usd_value?.toLocaleString()} USD
                </div>
              )}
              <div className="text-xs text-white/30 mt-1">
                {tx.timestamp ? format(new Date(tx.timestamp), 'MMM d, yyyy HH:mm') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}