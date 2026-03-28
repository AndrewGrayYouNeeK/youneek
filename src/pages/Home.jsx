import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Radar, Clock, Satellite, Gamepad2, Shield, Heart, Zap, Star, ChevronRight } from 'lucide-react';

const APPS = [
  {
    id: 'radar',
    name: 'YouNeeK Pro Radar',
    tagline: 'Military-grade storm tracking',
    description: 'Live NEXRAD radar, NWS severe weather alerts, tornado warnings, NOAA radio streaming, and emergency shelter alerts. Built for storm chasers.',
    url: 'https://youneekproradar.com',
    icon: Radar,
    color: 'from-green-500 to-emerald-600',
    glow: 'shadow-green-500/20',
    border: 'border-green-500/20 hover:border-green-400/50',
    tag: 'Weather',
    platform: 'Web · iOS',
    status: 'live',
  },
  {
    id: 'care',
    name: 'YouNeeK Care',
    tagline: 'Crypto with a heart',
    description: '2% of every transaction funds emergency vet care for animals in critical need. 100% transparent. Every wallet. Every transaction. Every life saved.',
    url: 'https://youneekcare.com',
    icon: Heart,
    color: 'from-orange-500 to-yellow-500',
    glow: 'shadow-orange-500/20',
    border: 'border-orange-500/20 hover:border-orange-400/50',
    tag: 'Crypto',
    platform: 'Web',
    status: 'live',
  },
  {
    id: 'time',
    name: 'YouNeeK Time',
    tagline: 'Time, elevated',
    description: 'A minimal, dark-themed world clock with widget mode. Custom YouNeeK-branded clock face with a glowing phosphor aesthetic. Pure and purposeful.',
    url: 'https://youneektime.com',
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
    border: 'border-blue-500/20 hover:border-blue-400/50',
    tag: 'Utility',
    platform: 'Web · Widget',
    status: 'live',
  },
  {
    id: 'satellite',
    name: 'YouNeeK Satellite Tracker',
    tagline: 'Eyes on the sky',
    description: 'Real-time satellite tracking on an interactive globe. Watch ISS, Starlink, and thousands of objects pass overhead. Live orbital data.',
    url: 'https://abiding-orbit-view-live.base44.app',
    icon: Satellite,
    color: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/20',
    border: 'border-purple-500/20 hover:border-purple-400/50',
    tag: 'Space',
    platform: 'Web',
    status: 'live',
  },
  {
    id: 'atlas',
    name: '3i Atlas — The Game',
    tagline: 'You are the comet',
    description: 'Stealth comet infiltration across the solar system. Navigate 7 levels from the Kuiper Belt to Mercury. Avoid hunters. Complete your ancient mission.',
    url: 'https://3iatlasgame.xyz',
    icon: Gamepad2,
    color: 'from-red-500 to-rose-600',
    glow: 'shadow-red-500/20',
    border: 'border-red-500/20 hover:border-red-400/50',
    tag: 'Game',
    platform: 'Web · Mobile',
    status: 'live',
  },
  {
    id: 'maskicon',
    name: 'MaskIcon',
    tagline: 'Your secrets, hidden in plain sight',
    description: 'Disguise your apps with custom decoy icons and labels. Password lock, stealth mode, and a full library manager. Privacy for your home screen.',
    url: '#',
    icon: Shield,
    color: 'from-slate-400 to-slate-500',
    glow: 'shadow-slate-500/20',
    border: 'border-slate-500/20 hover:border-slate-400/40',
    tag: 'Privacy',
    platform: 'iOS',
    status: 'coming',
  },
];

function AppCard({ app, index }) {
  const Icon = app.icon;
  const isComingSoon = app.status === 'coming';

  return (
    <motion.a
      href={isComingSoon ? undefined : app.url}
      target={isComingSoon ? undefined : '_blank'}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={isComingSoon ? {} : { y: -6, scale: 1.01 }}
      className={`group relative block rounded-2xl border bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 shadow-xl ${app.border} ${app.glow} ${isComingSoon ? 'cursor-default opacity-60' : 'cursor-pointer hover:bg-white/[0.06]'}`}
    >
      {/* Glow blob */}
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-xs text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              {app.platform}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              isComingSoon
                ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
            }`}>
              {isComingSoon ? 'Coming Soon' : '● Live'}
            </span>
          </div>
        </div>

        {/* Tag */}
        <div className="mb-2">
          <span className={`text-xs font-semibold uppercase tracking-widest bg-gradient-to-r ${app.color} bg-clip-text text-transparent`}>
            {app.tag}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors">
          {app.name}
        </h3>
        <p className="text-sm text-white/50 mb-3 italic">{app.tagline}</p>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed mb-5">
          {app.description}
        </p>

        {/* Footer */}
        {!isComingSoon && (
          <div className={`flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${app.color} bg-clip-text text-transparent`}>
            <span>Launch app</span>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </motion.a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050810] text-white selection:bg-orange-500/30">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px] -translate-x-1/2" />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">YouNeeK</span>
        </div>
        <a
          href="https://youneekcare.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1"
        >
          YouNeeK Care <ExternalLink className="w-3 h-3" />
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-8">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            Built by Andrew Gray
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.05] tracking-tight">
            <span className="text-white">You</span>
            <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 bg-clip-text text-transparent">NeeK</span>
            <br />
            <span className="text-white/60 text-4xl md:text-5xl font-light">Apps & Projects</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            A collection of apps built with purpose — weather tools, crypto, games, space, and privacy. Each one solves something real.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-12"
        >
          {[
            { value: `${APPS.filter(a => a.status === 'live').length}`, label: 'Live Apps' },
            { value: '6', label: 'Total Projects' },
            { value: '1', label: 'Developer' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/40 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* App Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {APPS.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span>YouNeeK · Built by Andrew Gray</span>
          </div>
          <span>© {new Date().getFullYear()} YouNeeK. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
