import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Flag, Rocket, Calendar, Clock, CheckCircle2, Target, ShieldCheck } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    in_progress: 'bg-blue-500/15 text-blue-300 border-blue-400/20',
    planned: 'bg-amber-500/15 text-amber-300 border-amber-400/20',
  };
  const label = {
    completed: 'Completed',
    in_progress: 'In Progress',
    planned: 'Planned',
  }[status] || status;
  return <Badge className={`${map[status]} border`}>{label}</Badge>;
}

function MilestoneCard({ item, isExpanded, onToggle }) {
  const Icon = item.icon || Flag;
  const id = `${item.phase}-${item.title}-${item.period}`;

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="group relative"
      onClick={() => onToggle(id)}
    >
      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10 cursor-pointer">
        {/* Timeline dot/connector */}
        <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-slate-950">
          <div className={`absolute left-1/2 -translate-x-1/2 top-1 w-2.5 h-2.5 rounded-full ${
            item.status === 'completed' ? 'bg-emerald-400' : item.status === 'in_progress' ? 'bg-blue-400' : 'bg-amber-400'
          }`} />
          <div className="absolute left-1/2 -translate-x-1/2 top-6 w-px h-[calc(100%+1.5rem)] bg-white/10" />
        </div>

        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-white font-semibold text-base truncate">{item.title}</h4>
              <StatusBadge status={item.status} />
            </div>
            <div className="text-xs text-white/60 flex items-center gap-2 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{item.period}</span>
            </div>
            <p className="text-white/70 text-sm line-clamp-2 md:line-clamp-2">{item.summary}</p>

            {/* Details: show on hover (md+) and when expanded (mobile) */}
            <div className={`mt-3 hidden md:block`}> 
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.update && (
                  <div className="text-white/80 text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-white/60" />
                      <span className="font-medium text-white">Status Update</span>
                    </div>
                    <p className="mt-1 text-white/70">{item.update}</p>
                  </div>
                )}
                {item.next && item.next.length > 0 && (
                  <div className="text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-white/60" />
                      <span className="font-medium text-white">Upcoming Goals</span>
                    </div>
                    <ul className="mt-1 list-disc pl-5 space-y-1 text-white/70">
                      {item.next.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile expandable details */}
            {isExpanded && (
              <div className="mt-3 md:hidden">
                {item.update && (
                  <div className="text-white/80 text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-white/60" />
                      <span className="font-medium text-white">Status Update</span>
                    </div>
                    <p className="mt-1 text-white/70">{item.update}</p>
                  </div>
                )}
                {item.next && item.next.length > 0 && (
                  <div className="text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-white/60" />
                      <span className="font-medium text-white">Upcoming Goals</span>
                    </div>
                    <ul className="mt-1 list-disc pl-5 space-y-1 text-white/70">
                      {item.next.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RoadmapSection() {
  const [expanded, setExpanded] = useState(null);

  const milestones = [
    // Past
    {
      phase: 'past',
      title: 'Concept & Branding Finalized',
      period: 'Q4 2025',
      status: 'completed',
      summary: 'Defined mission, token purpose, and visual identity for YouNeeK (YNK).',
      update: 'Community feedback incorporated; brand and messaging locked.',
      next: ['Publish media kit', 'Onboard ambassadors'],
      icon: Flag,
      color: 'from-purple-500 to-blue-500',
    },
    {
      phase: 'past',
      title: 'Transparency Dashboard v1',
      period: 'Q1 2026',
      status: 'completed',
      summary: 'Live wallet tracking and funded case showcase shipped.',
      update: 'Added real-time polling and transaction breakdowns.',
      next: ['Public CSV export', 'API for partners'],
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
    },

    // Current
    {
      phase: 'current',
      title: 'Launch Whitepaper + Payments',
      period: 'Q1 2026',
      status: 'in_progress',
      summary: 'Whitepaper live with PDF download; card donations enabled.',
      update: 'Tuning copy; polishing donation UX and receipts.',
      next: ['Finalize tokenomics numbers', 'Publish security proofs'],
      icon: Rocket,
      color: 'from-orange-500 to-yellow-500',
    },
    {
      phase: 'current',
      title: 'Security Disclosures (Lock / Multisig / Audit)',
      period: 'Q1–Q2 2026',
      status: 'in_progress',
      summary: 'Surface LP lock, renounce/multisig, and audit links across the site.',
      update: 'UI slots ready; awaiting final proof URLs to wire in.',
      next: ['Add proofs to homepage trust bar', 'Whitepaper section with status chips'],
      icon: ShieldCheck,
      color: 'from-blue-500 to-cyan-500',
    },

    // Future
    {
      phase: 'future',
      title: 'DEX Listing + Chart Widgets',
      period: 'Q2 2026',
      status: 'planned',
      summary: 'Deep links for buy flow and embedded price/MC widgets.',
      update: 'Evaluating providers and terms for chart integrations.',
      next: ['Set up buy links', 'Add price & holders widgets'],
      icon: Target,
      color: 'from-fuchsia-500 to-rose-500',
    },
    {
      phase: 'future',
      title: 'Governance & Case Voting',
      period: 'Q3 2026',
      status: 'planned',
      summary: 'Community voting to prioritize emergency vet cases.',
      update: 'Designs drafted for proposal creation and quorum rules.',
      next: ['Release governance spec', 'Pilot voting with select users'],
      icon: Calendar,
      color: 'from-indigo-500 to-violet-500',
    },
  ];

  const groups = {
    past: milestones.filter((m) => m.phase === 'past'),
    current: milestones.filter((m) => m.phase === 'current'),
    future: milestones.filter((m) => m.phase === 'future'),
  };

  const handleToggle = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <section id="roadmap" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-[420px] h-[420px] bg-gradient-to-br from-orange-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Roadmap</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            A transparent view of what we shipped, what we are building now, and what comes next.
          </p>
        </motion.div>

        {/* Columns: Past / Now / Next */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { key: 'past', title: 'Past', hint: 'Delivered Milestones' },
            { key: 'current', title: 'Now', hint: 'In Progress' },
            { key: 'future', title: 'Next', hint: 'Planned' },
          ].map((col) => (
            <div key={col.key} className="relative">
              <div className="sticky top-20 z-10 mb-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-white/90 font-semibold text-lg">{col.title}</h3>
                  <span className="text-xs text-white/50">{col.hint}</span>
                </div>
                <div className="mt-2 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <div className="space-y-4 pl-4">
                {groups[col.key].map((item) => (
                  <MilestoneCard
                    key={`${item.phase}-${item.title}-${item.period}`}
                    item={item}
                    isExpanded={expanded === `${item.phase}-${item.title}-${item.period}`}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Completed
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20">
            <span className="h-2 w-2 rounded-full bg-blue-400" /> In Progress
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/20">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Planned
          </div>
        </div>
      </div>
    </section>
  );
}