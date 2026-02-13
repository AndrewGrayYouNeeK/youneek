import React from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import MissionSection from '@/components/home/MissionSection';
import TransparencySection from '@/components/home/TransparencySection';
import ImpactSection from '@/components/home/ImpactSection';
import ApplySection from '@/components/home/ApplySection';
import HowToBuySection from '@/components/home/HowToBuySection';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <TransparencySection />
      <ImpactSection />
      <ApplySection />
      <HowToBuySection />
      <Footer />
    </div>
  );
}