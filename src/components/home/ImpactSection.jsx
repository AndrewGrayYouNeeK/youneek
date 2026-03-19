import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, DollarSign, ExternalLink, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

function ImpactCard({ application }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {application.pet_photo_url ? (
          <img 
            src={application.pet_photo_url} 
            alt={application.pet_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center">
            <Heart className="w-16 h-16 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-3 left-3 bg-green-500/90 text-white">
          ✓ Funded
        </Badge>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white">{application.pet_name}</h3>
          <p className="text-white/70 text-sm capitalize">{application.pet_type}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-white/60 text-sm mb-4 line-clamp-2">
          {application.emergency_description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-white/40 mb-1">Funded Amount</div>
            <div className="text-lg font-bold text-green-400">
              ${application.funded_amount?.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/40 mb-1">Date</div>
            <div className="text-sm text-white/70">
              {application.updated_date ? format(new Date(application.updated_date), 'MMM d, yyyy') : 'N/A'}
            </div>
          </div>
        </div>

        {application.outcome_description && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
            <div className="text-xs text-green-400 font-semibold mb-1">Outcome</div>
            <p className="text-white/70 text-sm line-clamp-2">{application.outcome_description}</p>
          </div>
        )}

        {application.funding_tx_hash && (
          <Button variant="ghost" size="sm" className="w-full text-white/50 hover:text-white hover:bg-white/10">
            <span className="font-mono text-xs truncate mr-2">
              Tx: {application.funding_tx_hash?.slice(0, 16)}...
            </span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function ImpactSection() {
  const { data: applications = [] } = useQuery({
    queryKey: ['funded-applications'],
    queryFn: () => base44.entities.VetAssistanceApplication.filter({ status: 'funded', is_public: true }, '-updated_date', 20),
  });

  const totalFunded = applications.reduce((sum, app) => sum + (app.funded_amount || 0), 0);

  return (
    <section id="impact" className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Lives <span className="text-orange-400">Saved</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Real animals. Real emergencies. Real help. Every case documented with proof.
          </p>

          {/* Stats */}
          <div className="inline-flex items-center gap-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">2</div>
              <div className="text-sm text-white/50">Animals Helped</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">${totalFunded.toLocaleString()}</div>
              <div className="text-sm text-white/50">Total Funded</div>
            </div>
          </div>
        </motion.div>

        {applications.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.slice(0, 6).map((app) => (
              <ImpactCard key={app.id} application={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">Impact stories will appear here once animals are helped</p>
          </div>
        )}

        {applications.length > 6 && (
          <div className="text-center mt-10">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              View All Success Stories
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}