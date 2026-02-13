import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Heart, CheckCircle, XCircle, Clock, DollarSign, 
  ExternalLink, Eye, ChevronDown, Loader2, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  funded: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  funded: DollarSign,
  rejected: XCircle,
};

export default function Admin() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: () => base44.entities.VetAssistanceApplication.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.VetAssistanceApplication.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-applications']);
      setSelectedApp(null);
    }
  });

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(a => a.status === filter);

  const stats = {
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    funded: applications.filter(a => a.status === 'funded').length,
    totalFunded: applications.filter(a => a.status === 'funded').reduce((sum, a) => sum + (a.funded_amount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Link>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/50">Manage vet assistance applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{stats.pending}</div>
                  <div className="text-sm text-white/50">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{stats.approved}</div>
                  <div className="text-sm text-white/50">Approved</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{stats.funded}</div>
                  <div className="text-sm text-white/50">Funded</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">${stats.totalFunded.toLocaleString()}</div>
                  <div className="text-sm text-white/50">Total Funded</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="funded">Funded</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-white/50">{filteredApps.length} applications</span>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const StatusIcon = statusIcons[app.status] || Clock;
              return (
                <Card 
                  key={app.id} 
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedApp(app)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Pet Photo */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 shrink-0">
                        {app.pet_photo_url ? (
                          <img src={app.pet_photo_url} alt={app.pet_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white/20" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-white">{app.pet_name}</h3>
                          <Badge className={statusColors[app.status]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-white/50 text-sm truncate">{app.emergency_description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
                          <span>{app.owner_name}</span>
                          <span>•</span>
                          <span>{app.vet_clinic_name}</span>
                          <span>•</span>
                          <span>{format(new Date(app.created_date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right shrink-0">
                        <div className="text-xl font-bold text-white">${app.amount_requested?.toLocaleString()}</div>
                        <div className="text-sm text-white/40">requested</div>
                      </div>

                      <Eye className="w-5 h-5 text-white/30" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredApps.length === 0 && (
              <div className="text-center py-20 text-white/40">
                No applications found
              </div>
            )}
          </div>
        )}

        {/* Application Detail Modal */}
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedApp && (
              <ApplicationDetail 
                application={selectedApp} 
                onUpdate={(data) => updateMutation.mutate({ id: selectedApp.id, data })}
                isUpdating={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ApplicationDetail({ application, onUpdate, isUpdating }) {
  const [status, setStatus] = useState(application.status);
  const [fundedAmount, setFundedAmount] = useState(application.funded_amount || '');
  const [txHash, setTxHash] = useState(application.funding_tx_hash || '');
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || '');
  const [outcomeDesc, setOutcomeDesc] = useState(application.outcome_description || '');
  const [isPublic, setIsPublic] = useState(application.is_public || false);

  const handleSave = () => {
    onUpdate({
      status,
      funded_amount: parseFloat(fundedAmount) || null,
      funding_tx_hash: txHash || null,
      admin_notes: adminNotes || null,
      outcome_description: outcomeDesc || null,
      is_public: isPublic,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          {application.pet_photo_url && (
            <img src={application.pet_photo_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
          )}
          <div>
            <div>{application.pet_name}</div>
            <div className="text-sm font-normal text-white/50">{application.pet_type}</div>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Emergency Details */}
        <div>
          <h4 className="text-sm font-semibold text-white/70 mb-2">Emergency Description</h4>
          <p className="text-white/80 bg-white/5 rounded-xl p-4">{application.emergency_description}</p>
        </div>

        {/* Contact & Vet */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-2">Owner</h4>
            <div className="text-white">{application.owner_name}</div>
            <div className="text-white/50 text-sm">{application.owner_email}</div>
            <div className="text-white/50 text-sm">{application.owner_phone}</div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-2">Vet Clinic</h4>
            <div className="text-white">{application.vet_clinic_name}</div>
            <div className="text-white/50 text-sm">{application.vet_clinic_address}</div>
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm text-white/50">Estimated Cost</div>
            <div className="text-2xl font-bold text-white">${application.estimated_cost?.toLocaleString()}</div>
          </div>
          <div className="bg-orange-500/10 rounded-xl p-4">
            <div className="text-sm text-orange-400">Amount Requested</div>
            <div className="text-2xl font-bold text-orange-400">${application.amount_requested?.toLocaleString()}</div>
          </div>
        </div>

        {/* Documentation */}
        {application.documentation_url && (
          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-2">Documentation</h4>
            <a 
              href={application.documentation_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:underline"
            >
              View uploaded file <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Admin Actions */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <h4 className="text-lg font-semibold text-white">Admin Actions</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-white/70">Funded Amount (USD)</label>
              <Input 
                type="number"
                value={fundedAmount}
                onChange={(e) => setFundedAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70">Transaction Hash</label>
            <Input 
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x..."
              className="bg-white/5 border-white/10 text-white mt-1 font-mono"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Admin Notes (internal)</label>
            <Textarea 
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="bg-white/5 border-white/10 text-white mt-1"
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Outcome Description (public)</label>
            <Textarea 
              value={outcomeDesc}
              onChange={(e) => setOutcomeDesc(e.target.value)}
              placeholder="What happened after funding? (for success stories)"
              className="bg-white/5 border-white/10 text-white mt-1"
              rows={2}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-white/70">Show as public success story</span>
          </label>

          <Button 
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}