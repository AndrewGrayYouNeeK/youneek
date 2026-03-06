import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="text-white text-3xl font-semibold mb-2">Thank you for your donation!</h1>
        <p className="text-white/70 mb-6">Your contribution helps fund emergency veterinary care for pets in need. We appreciate your support.</p>
        <Link to={createPageUrl('Home')}>
          <Button className="bg-emerald-600 hover:bg-emerald-700 inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}