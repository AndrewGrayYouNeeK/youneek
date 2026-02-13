import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Coins, Stethoscope, CheckCircle } from 'lucide-react';

export default function MissionSection() {
  const steps = [
    {
      icon: Coins,
      title: 'You Trade',
      description: 'Every buy or sell transaction includes a 2% tax automatically collected by the smart contract.',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Heart,
      title: 'Tax Goes to Charity',
      description: 'The 2% tax is instantly sent to our transparent charity treasury wallet.',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Stethoscope,
      title: 'Vets Get Paid',
      description: 'Pet owners in emergencies apply for help. We pay the vet directly.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: CheckCircle,
      title: 'Lives Saved',
      description: 'Every case is publicly documented with proof. Full transparency, real impact.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section id="mission" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It <span className="text-orange-400">Works</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            A simple mechanism that turns every trade into a lifeline for animals in need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-white/20 to-transparent z-0" />
              )}
              
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-sm font-bold text-white/60">
                  {i + 1}
                </div>

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tokenomics highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                100,000,000,000
              </div>
              <div className="text-white/60">Total Token Supply</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                2%
              </div>
              <div className="text-white/60">Tax on All Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-white/60">Tax Goes to Animals</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}