import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowRightLeft, Coins, CheckCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CONTRACT_ADDRESS = '0xYOUNEEK...CONTRACT';

export default function HowToBuySection() {
  const [copied, setCopied] = React.useState(false);

  const copyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: Wallet,
      title: 'Get a Wallet',
      description: 'Download MetaMask or any Web3 wallet. Add the Plasma network.',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Coins,
      title: 'Get ETH/PLASMA',
      description: 'Buy ETH or native Plasma tokens from an exchange and send to your wallet.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ArrowRightLeft,
      title: 'Swap for YouNeeK',
      description: 'Go to a DEX (like Uniswap), paste the contract address, and swap.',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: CheckCircle,
      title: 'Hold & Help',
      description: 'Every transaction generates 2% for animal emergencies. Welcome to YouNeeK!',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="how-to-buy" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How to <span className="text-orange-400">Buy</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Get YouNeeK tokens in 4 simple steps. Join the community that saves lives.
          </p>
        </motion.div>

        {/* Contract Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 border border-white/10 rounded-2xl p-6 mb-12 max-w-2xl mx-auto"
        >
          <div className="text-sm text-white/50 mb-2">Contract Address (Plasma)</div>
          <div className="flex items-center gap-3">
            <code className="flex-1 font-mono text-lg text-white bg-black/30 rounded-xl px-4 py-3 overflow-x-auto">
              {CONTRACT_ADDRESS}
            </code>
            <Button 
              onClick={copyContract}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent z-0" style={{ width: 'calc(100% - 2rem)' }} />
              )}

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl font-bold text-white/10 mb-4">{i + 1}</div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-6 text-lg rounded-xl"
          >
            Buy on DEX
            <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
          >
            View Chart
            <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}